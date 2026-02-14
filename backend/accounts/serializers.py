from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, StaffProfile

User = get_user_model()

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['student_id', 'grade']

class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = ['department', 'designation']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_student', 'is_school_staff']

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Fields specific to profiles can be handled here or in separate endpoint
    # Let's handle generic signup first, profile update later, or combined.
    # Combined is better for UX.
    student_id = serializers.CharField(required=False, allow_blank=True)
    grade = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    designation = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=['student', 'staff'], write_only=True)

    def validate(self, data):
        if data.get('role') == 'student':
            if not data.get('student_id'):
                raise serializers.ValidationError({'student_id': 'This field is required for students.'})
            if not data.get('grade'):
                raise serializers.ValidationError({'grade': 'This field is required for students.'})
        elif data.get('role') == 'staff':
            if not data.get('department'):
                raise serializers.ValidationError({'department': 'This field is required for staff.'})
            if not data.get('designation'):
                raise serializers.ValidationError({'designation': 'This field is required for staff.'})
        return data

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'role', 'student_id', 'grade', 'department', 'designation']

    def create(self, validated_data):
        role = validated_data.pop('role')
        student_data = {k: validated_data.pop(k) for k in ['student_id', 'grade'] if k in validated_data}
        staff_data = {k: validated_data.pop(k) for k in ['department', 'designation'] if k in validated_data}
        
        user = User.objects.create_user(**validated_data)
        
        if role == 'student':
            user.is_student = True
            StudentProfile.objects.create(user=user, **student_data)
        elif role == 'staff':
            user.is_school_staff = True
            StaffProfile.objects.create(user=user, **staff_data)
            
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField()
