'use client'

import Header from '@/components/Header';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { AuthProvider } from '@/components/admin/AuthProvider';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function AdminPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <AdminDashboard />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}