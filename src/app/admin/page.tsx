'use client'

import Header from '@/components/Header';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { AuthProvider } from '@/components/admin/AuthProvider';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | leocarz',
  description: 'Manage cars, add new listings, and update inventory.',
};

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