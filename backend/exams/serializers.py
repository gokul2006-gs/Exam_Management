from rest_framework import serializers
from .models import Exam, Registration, StudyMaterial, StudentDocument
from accounts.serializers import UserSerializer

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    student_details = UserSerializer(source='student', read_only=True)
    exam_details = ExamSerializer(source='exam', read_only=True)
    
    class Meta:
        model = Registration
        fields = ['id', 'student', 'exam', 'payment_status', 'payment_date', 'registration_date', 'student_details', 'exam_details']
        read_only_fields = ['payment_status', 'payment_date', 'registration_date']

class StudyMaterialSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    
    class Meta:
        model = StudyMaterial
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'created_at']

class StudentDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDocument
        fields = '__all__'
        read_only_fields = ['is_verified', 'ai_feedback', 'uploaded_at', 'student']
