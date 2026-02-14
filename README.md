# Exam Management System

## Prerequisites
- Python 3.x
- Node.js & npm
- MySQL Server

## Setup Instructions

### 1. Database Setup
Ensure your MySQL server is running. Create a database named `school_exam_db`.
If your MySQL root password is not empty, update `backend/config/settings.py`:
```python
DATABASES = {
    'default': {
        ...
        'PASSWORD': 'your_password',
        ...
    }
}
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
(Note: I've already installed dependencies in the environment, so just activate and run)

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Authentication**: JWT/Session based login/signup for Students and Staff.
- **Forgot Password**: OTP verification via email (console backend).
- **Dashboard**: Role-based redirection.
- **Responsive Design**: Premium dark-mode aesthetic with glassmorphism.

## Pages Included
- Home
- Login
- Signup
- Forgot Password
- Verify OTP
- Reset Password
- Dashboard (Student/Staff views)
