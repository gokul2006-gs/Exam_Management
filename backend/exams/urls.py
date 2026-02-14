from django.urls import path
from .views import (
    ExamListCreateView, ExamDetailView,
    register_for_exam, simulate_payment, StudentRegistrationsListView, ExamRegistrationsListView,
    StudyMaterialListCreateView, StudentDocumentUploadView, AIRAGAdviceView
)

urlpatterns = [
    # Exam Management
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    
    # Registration & Payment
    path('register/<int:exam_id>/', register_for_exam, name='register-exam'),
    path('payment/<int:registration_id>/', simulate_payment, name='simulate-payment'),
    path('registrations/student/', StudentRegistrationsListView.as_view(), name='student-registrations'),
    path('registrations/staff/', ExamRegistrationsListView.as_view(), name='staff-exam-registrations'),
    
    # Study Materials
    path('materials/', StudyMaterialListCreateView.as_view(), name='material-list-create'),
    
    # AI/RAG
    path('ai/verify-document/', StudentDocumentUploadView.as_view(), name='ai-verify-doc'),
    path('ai/advice/', AIRAGAdviceView.as_view(), name='ai-advice'),
]
