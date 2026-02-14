from django.db import models
from django.conf import settings
from django.utils import timezone

class Exam(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    venue = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField(default=100)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Registration(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='registrations')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='registrations')
    payment_status = models.BooleanField(default=False)
    payment_date = models.DateTimeField(null=True, blank=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('student', 'exam')

    def __str__(self):
        return f"{self.student.email} - {self.exam.title}"

class StudyMaterial(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file_url = models.URLField(max_length=500, blank=True, help_text="Link to material or file") 
    # In a real app we would use FileField, but for Simplicity/Demo we might just use URL or store file path.
    # Let's use FileField but we need media root setup. For now, let's stick to URLField or dummy FileField usage if needed.
    # User asked for uploads. Let's try FileField but handle Media setup.
    file = models.FileField(upload_to='materials/', null=True, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='materials')
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True, blank=True, related_name='materials')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class StudentDocument(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=100)
    file = models.FileField(upload_to='student_docs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    ai_feedback = models.TextField(blank=True, help_text="AI Analysis of the document")

    def __str__(self):
        return f"{self.student.email} - {self.document_type}"
