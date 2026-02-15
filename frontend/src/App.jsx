import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

import Profile from './pages/Profile';
import Exams from './pages/Exams';
import ExamDetails from './pages/ExamDetails';
import MyRegistrations from './pages/MyRegistrations';
import StudyMaterials from './pages/StudyMaterials';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* New Pages */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:id" element={<ExamDetails />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
