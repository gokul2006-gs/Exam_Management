from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.core.mail import send_mail
from django.conf import settings
from .models import OTP, StudentProfile, StaffProfile
from .serializers import (
    UserSerializer, SignupSerializer, LoginSerializer,
    ForgotPasswordSerializer, VerifyOTPSerializer, ResetPasswordSerializer
)
import random

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.authtoken.models import Token 

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(username=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            login(request, user)
            data = UserSerializer(user).data
            data['token'] = token.key
            return Response(data, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            otp_code = str(random.randint(100000, 999999))
            OTP.objects.update_or_create(user=user, defaults={'otp_code': otp_code})
            
            send_mail(
                'Password Reset OTP',
                f'Your OTP is {otp_code}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return Response({'detail': 'OTP sent to email'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    serializer = VerifyOTPSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp']
        try:
            user = User.objects.get(email=email)
            otp_record = OTP.objects.get(user=user)
            if otp_record.otp_code == otp_code and otp_record.is_valid():
                return Response({'detail': 'OTP verified'}, status=status.HTTP_200_OK)
            return Response({'detail': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, OTP.DoesNotExist):
            return Response({'detail': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp'] # Verify again for security
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(email=email)
            otp_record = OTP.objects.get(user=user)
            if otp_record.otp_code == otp_code and otp_record.is_valid():
                user.set_password(new_password)
                user.save()
                otp_record.delete() # Consume OTP
                return Response({'detail': 'Password reset successful'}, status=status.HTTP_200_OK)
            return Response({'detail': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, OTP.DoesNotExist):
            return Response({'detail': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
