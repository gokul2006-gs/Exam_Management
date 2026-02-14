from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from exams.models import Exam, StudyMaterial, Registration
from accounts.models import StudentProfile, StaffProfile
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with dummy data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating dummy data...')

        # Create Students
        students = []
        for i in range(5):
            email = f'student{i+1}@school.edu'
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    username=f'student{i+1}',
                    email=email,
                    password='password123',
                    is_student=True
                )
                StudentProfile.objects.create(
                    user=user,
                    student_id=f'S-2024-{100+i}',
                    grade=f'{10 + (i % 3)}th Grade'
                )
                students.append(user)
                self.stdout.write(f'Created student: {email}')
            else:
                students.append(User.objects.get(email=email))

        # Create Staff
        staff_members = []
        for i in range(2):
            email = f'staff{i+1}@school.edu'
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    username=f'staff{i+1}',
                    email=email,
                    password='password123',
                    is_school_staff=True
                )
                StaffProfile.objects.create(
                    user=user,
                    department='Science' if i == 0 else 'Mathematics',
                    designation='Senior Teacher'
                )
                staff_members.append(user)
                self.stdout.write(f'Created staff: {email}')
            else:
                staff_members.append(User.objects.get(email=email))

        # Create Exams
        exam_titles = [
            ('Mid-Term Mathematics', 'Comprehensive algebra and geometry assessment.'),
            ('Physics Final', 'Final examination covering mechanics and thermodynamics.'),
            ('English Literature', 'Essay writing and reading comprehension.'),
            ('Computer Science 101', 'Basics of programming and algorithms.'),
            ('History World War II', 'Detailed analysis of WWII events.')
        ]

        exams = []
        base_date = timezone.now().date()
        for i, (title, desc) in enumerate(exam_titles):
            if not Exam.objects.filter(title=title).exists():
                exam_date = base_date + timedelta(days=random.randint(5, 30))
                exam = Exam.objects.create(
                    title=title,
                    description=desc,
                    date=exam_date,
                    time=timezone.now().time(),
                    venue=f'Hall {chr(65+i)}',
                    fee=random.choice([0.00, 50.00, 100.00]),
                    capacity=50
                )
                exams.append(exam)
                self.stdout.write(f'Created exam: {title}')
            else:
                exams.append(Exam.objects.get(title=title))

        # Create Study Materials
        materials_data = [
            ('Algebra Cheat Sheet', 'Quick reference for algebraic formulas'),
            ('Physics Laws Summary', 'Newton\'s laws and more explained'),
            ('Shakespeare Guide', 'Notes on Macbeth and Hamlet'),
            ('Python Basics', 'Intro to multiple variables and loops'),
            ('WWII Timeline', 'Key dates and events')
        ]

        for i, (title, desc) in enumerate(materials_data):
            if not StudyMaterial.objects.filter(title=title).exists():
                StudyMaterial.objects.create(
                    title=title,
                    description=desc,
                    uploaded_by=random.choice(staff_members) if staff_members else None,
                    exam=exams[i] if i < len(exams) else None,
                    # We leave file/file_url empty for now or put a dummy url
                    file_url=f'https://example.com/materials/{i}.pdf'
                )
                self.stdout.write(f'Created material: {title}')

        # Create Registrations (Randomly register students to exams)
        for student in students:
            # Register for 1-2 exams
            exams_to_register = random.sample(exams, k=random.randint(1, 2))
            for exam in exams_to_register:
                if not Registration.objects.filter(student=student, exam=exam).exists():
                    Registration.objects.create(
                        student=student,
                        exam=exam,
                        payment_status=True if exam.fee > 0 else False # Just random logic
                    )
                    self.stdout.write(f'Registered {student.username} for {exam.title}')

        self.stdout.write(self.style.SUCCESS('Successfully populated dummy data'))
