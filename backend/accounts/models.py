from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import datetime

class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_school_staff = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    
    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # username is still required by AbstractUser but we want email to be primary login

    def __str__(self):
        return self.email

class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        # Valid for 10 minutes
        return self.created_at + datetime.timedelta(minutes=10) > timezone.now()

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    student_id = models.CharField(max_length=20)
    grade = models.CharField(max_length=10)
    
    def __str__(self):
        return f"{self.user.email} - Student"

class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    department = models.CharField(max_length=50)
    designation = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.email} - Staff"
