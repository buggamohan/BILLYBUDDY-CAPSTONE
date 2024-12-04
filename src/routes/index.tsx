import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/Home';
import QASection from '../components/QASection';
import ExperienceSharing from '../components/ExperienceSharing';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminQA from '../components/admin/AdminQA';
import AdminExperiences from '../components/admin/AdminExperiences';
import UserReportsList from '../components/admin/UserReportsList';
import CybercrimeWebsite from '../components/admin/CybercrimeWebsite';
import UserDashboard from '../components/dashboard/UserDashboard';
import Auth from '../components/Auth';
import PrivateRoute from './PrivateRoute';
import AIChatSupport from '../components/chat/AIChatSupport';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/dashboard" element={<PrivateRoute element={<UserDashboard />} />} />
      <Route path="/qa" element={<QASection />} />
      <Route path="/experiences" element={<ExperienceSharing />} />
      <Route path="/ai-chat" element={<AIChatSupport />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} requireAdmin />} />
      <Route path="/admin/qa" element={<PrivateRoute element={<AdminQA />} requireAdmin />} />
      <Route path="/admin/experiences" element={<PrivateRoute element={<AdminExperiences />} requireAdmin />} />
      <Route path="/admin/reports" element={<PrivateRoute element={<UserReportsList />} requireAdmin />} />
      <Route path="/admin/cybercrime" element={<PrivateRoute element={<CybercrimeWebsite />} requireAdmin />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;