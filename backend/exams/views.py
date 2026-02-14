from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Exam, Registration, StudyMaterial, StudentDocument
from .serializers import ExamSerializer, RegistrationSerializer, StudyMaterialSerializer, StudentDocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.conf import settings

# --- Exam Views ---
class ExamListCreateView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Only staff can create exams (logic can be enforced here or in permissions)
        if self.request.user.is_school_staff or self.request.user.is_superuser:
            serializer.save()
        else:
             raise permissions.PermissionDenied("Only staff can create exams.")

class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_update(self, serializer):
        if self.request.user.is_school_staff or self.request.user.is_superuser:
            serializer.save()
        else:
             raise permissions.PermissionDenied("Only staff can edit exams.")

# --- Registration & Payment Views ---
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def register_for_exam(request, exam_id):
    exam = get_object_or_404(Exam, pk=exam_id)
    student = request.user
    
    if Registration.objects.filter(student=student, exam=exam).exists():
        return Response({'detail': 'Already registered for this exam.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create unpaid registration
    registration = Registration.objects.create(student=student, exam=exam)
    serializer = RegistrationSerializer(registration)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def simulate_payment(request, registration_id):
    registration = get_object_or_404(Registration, pk=registration_id, student=request.user)
    
    if registration.payment_status:
        return Response({'detail': 'Payment already completed.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Simulate Logic
    payment_success = True # In real world, check Stripe/PayPal response
    
    if payment_success:
        registration.payment_status = True
        registration.payment_date = timezone.now()
        registration.save()
        
        # Send Email
        try:
            send_mail(
                subject=f'Registration Confirmed: {registration.exam.title}',
                message=f'Dear {request.user.username},\n\nYour registration for {registration.exam.title} is successful.\n\nExam Details:\nDate: {registration.exam.date}\nTime: {registration.exam.time}\nVenue: {registration.exam.venue}\n\nPlease reach out if you have any questions.\n\nBest,\nExam Admin',
                from_email=settings.EMAIL_HOST_USER, # uses console backend
                recipient_list=[request.user.email],
                fail_silently=False
            )
        except Exception as e:
            print(f"Email failed: {e}")

        return Response({'detail': 'Payment successful and registration confirmed.'}, status=status.HTTP_200_OK)
    
    return Response({'detail': 'Payment failed.'}, status=status.HTTP_400_BAD_REQUEST)

class StudentRegistrationsListView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(student=self.request.user)

class ExamRegistrationsListView(generics.ListAPIView): # For Staff
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not (self.request.user.is_school_staff or self.request.user.is_superuser):
             return Registration.objects.none()
        
        exam_id = self.request.query_params.get('exam_id')
        if exam_id:
            return Registration.objects.filter(exam_id=exam_id)
        return Registration.objects.all()

# --- Study Material Views ---
class StudyMaterialListCreateView(generics.ListCreateAPIView):
    queryset = StudyMaterial.objects.all()
    serializer_class = StudyMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        if self.request.user.is_school_staff or self.request.user.is_superuser:
            serializer.save(uploaded_by=self.request.user)
        else:
             raise permissions.PermissionDenied("Only staff can upload materials.")

    def get_queryset(self):
        # Filtering materials by exam if needed
        exam_id = self.request.query_params.get('exam_id')
        if exam_id:
            return StudyMaterial.objects.filter(exam_id=exam_id)
        return StudyMaterial.objects.all()

# --- AI/RAG Views ---
class StudentDocumentUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        serializer = StudentDocumentSerializer(data=request.data)
        if serializer.is_valid():
            # Save document
            doc_instance = serializer.save(student=request.user)
            
            # --- AI EVALUATION PLACEHOLDER ---
            # Here we would call an RAG pipeline or LLM API
            # For now, we simulate a simple check.
            
            feedback = "Document received. "
            verification_status = False
            
            # Simple Heuristic: If file size > 0, we assume it's valid for demo
            if doc_instance.file.size > 0:
                verification_status = True
                feedback += "AI Analysis: Document appears to be valid. Eligibility Confirmed."
            else:
                feedback += "AI Analysis: Document is empty. Eligibility Denied."
                
            doc_instance.is_verified = verification_status
            doc_instance.ai_feedback = feedback
            doc_instance.save()
            
            return Response(StudentDocumentSerializer(doc_instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AIRAGAdviceView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        query = request.data.get('query', '')
        # --- RAG SIMULATION ---
        # 1. Search keywords in StudyMaterial descriptions
        # 2. Return relevant material + generated advice
        
        relevant_materials = StudyMaterial.objects.filter(description__icontains=query)
        if not relevant_materials:
             relevant_materials = StudyMaterial.objects.all()[:3] # fallback
             
        material_titles = [m.title for m in relevant_materials]
        
        advice = f"Based on your query '{query}', I suggest reviewing the following materials: {', '.join(material_titles)}. Ensure you focus on the core concepts outlined in the syllabus."
        
        return Response({'advice': advice, 'relevant_materials': StudyMaterialSerializer(relevant_materials, many=True).data})
