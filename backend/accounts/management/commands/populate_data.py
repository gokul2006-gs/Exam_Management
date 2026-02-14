from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import StudentProfile, StaffProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with dummy data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting dummy data population...')
        
        # Create Students
        students = [
            {'email': 'student1@exam.com', 'username': 'student1', 'password': 'password123', 'student_id': 'S001', 'grade': '10A'},
            {'email': 'student2@exam.com', 'username': 'student2', 'password': 'password123', 'student_id': 'S002', 'grade': '10B'},
            {'email': 'john.doe@exam.com', 'username': 'johndoe', 'password': 'password123', 'student_id': 'S003', 'grade': '12A'},
            {'email': 'jane.smith@exam.com', 'username': 'janesmith', 'password': 'password123', 'student_id': 'S004', 'grade': '9C'},
            {'email': 'mike.ross@exam.com', 'username': 'mikeross', 'password': 'password123', 'student_id': 'S005', 'grade': '11B'},
        ]

        for data in students:
            if not User.objects.filter(email=data['email']).exists():
                user = User.objects.create_user(
                    username=data['username'],
                    email=data['email'],
                    password=data['password']
                )
                user.is_student = True
                user.save()
                StudentProfile.objects.create(
                    user=user,
                    student_id=data['student_id'],
                    grade=data['grade']
                )
                self.stdout.write(self.style.SUCCESS(f"Created student: {data['email']}"))
            else:
                self.stdout.write(self.style.WARNING(f"Student already exists: {data['email']}"))

        # Create Staff
        staff = [
            {'email': 'staff1@exam.com', 'username': 'staff1', 'password': 'password123', 'department': 'Science', 'designation': 'HOD'},
            {'email': 'test.teacher@exam.com', 'username': 'testteacher', 'password': 'password123', 'department': 'Math', 'designation': 'Teacher'},
            {'email': 'principal@exam.com', 'username': 'principal', 'password': 'password123', 'department': 'Admin', 'designation': 'Principal'},
            {'email': 'admin@exam.com', 'username': 'adminuser', 'password': 'password123', 'department': 'IT', 'designation': 'SysAdmin'},
        ]

        for data in staff:
            if not User.objects.filter(email=data['email']).exists():
                user = User.objects.create_user(
                    username=data['username'],
                    email=data['email'],
                    password=data['password']
                )
                user.is_school_staff = True
                user.save()
                StaffProfile.objects.create(
                    user=user,
                    department=data['department'],
                    designation=data['designation']
                )
                self.stdout.write(self.style.SUCCESS(f"Created staff: {data['email']}"))
            else:
                self.stdout.write(self.style.WARNING(f"Staff already exists: {data['email']}"))
        
        self.stdout.write(self.style.SUCCESS('Finished populating dummy data.'))
