'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashEmployee, CarWashService, CarWashJob, CarWashJobWithRelations } from '@/types/database';
import NewJobForm from './NewJobForm';
import JobsList from './JobsList';
import EmployeeManagement from './EmployeeManagement';
import ServiceManagement from './ServiceManagement';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';
import ExpenseManagement from './ExpenseManagement';
import ProfitLossAnalytics from './ProfitLossAnalytics';

type TabType = 'jobs' | 'employees' | 'services' | 'expenses' | 'analytics';

interface Stats {
  todayJobs: number;
  pendingJobs: number;
  totalRevenue: number;
  employeeCount: number;
  monthlyExpenses: number;
  monthlyProfit: number;
}

export default function SimpleCarWashDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CarWashJobWithRelations | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({ 
    todayJobs: 0, 
    pendingJobs: 0, 
    totalRevenue: 0, 
    employeeCount: 0,
    monthlyExpenses: 0,
    monthlyProfit: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayDate = new Date();
      
      // Get today's jobs
      const { data: todayJobs } = await supabase
        .from('car_wash_jobs')
        .select('*')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`);

      // Get pending jobs
      const { data: pendingJobs } = await supabase
        .from('car_wash_jobs')
        .select('*')
        .in('status', ['pending', 'in_progress']);

      // Get total revenue (completed jobs)
      const { data: completedJobs } = await supabase
        .from('car_wash_jobs')
        .select('total_amount')
        .eq('status', 'completed');

      // Get active employees count
      const { data: employees } = await supabase
        .from('car_wash_employees')
        .select('id')
        .eq('is_active', true);

      const totalRevenue = completedJobs?.reduce((sum, job) => sum + Number(job.total_amount), 0) || 0;

      // Get this month's expenses
      const firstDayOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1).toISOString().split('T')[0];
      const { data: monthlyExpensesData } = await supabase
        .from('car_wash_expenses')
        .select('amount')
        .gte('expense_date', firstDayOfMonth);

      const monthlyExpenses = monthlyExpensesData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

      // Get this month's revenue
      const { data: monthlyRevenueData } = await supabase
        .from('car_wash_jobs')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('completed_at', firstDayOfMonth);

      const monthlyRevenue = monthlyRevenueData?.reduce((sum, job) => sum + Number(job.total_amount), 0) || 0;

      // Get this month's commissions
      const { data: monthlyCommissionsData } = await supabase
        .from('car_wash_commissions')
        .select('commission_amount')
        .gte('created_at', firstDayOfMonth);

      const monthlyCommissions = monthlyCommissionsData?.reduce((sum, comm) => sum + Number(comm.commission_amount), 0) || 0;

      const monthlyProfit = monthlyRevenue - monthlyExpenses - monthlyCommissions;

      setStats({
        todayJobs: todayJobs?.length || 0,
        pendingJobs: pendingJobs?.length || 0,
        totalRevenue,
        employeeCount: employees?.length || 0,
        monthlyExpenses,
        monthlyProfit
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = () => {
    setShowNewJobForm(false);
    fetchStats();
  };

  const handlePayJob = (job: CarWashJobWithRelations) => {
    setSelectedJob(job);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (payment: any) => {
    setShowPaymentModal(false);
    setSelectedPayment(payment);
    setShowReceiptModal(true);
    fetchStats();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Car Wash Management</h2>
          <p className="text-slate-600">Simple workflow for car wash operations</p>
        </div>
        
        <button
          onClick={() => setShowNewJobForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Car Wash Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Jobs</p>
              <p className="text-2xl font-bold text-slate-900">{stats.todayJobs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Jobs</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingJobs}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Employees</p>
              <p className="text-2xl font-bold text-purple-600">{stats.employeeCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.monthlyExpenses)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-6 ${
          stats.monthlyProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Monthly Profit</p>
              <p className={`text-2xl font-bold ${
                stats.monthlyProfit >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {formatCurrency(stats.monthlyProfit)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.monthlyProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <svg className={`w-6 h-6 ${
                stats.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                  stats.monthlyProfit >= 0
                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                } />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'jobs'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Car Wash Jobs
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'employees'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Employees
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'services'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Services & Pricing
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'expenses'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {activeTab === 'jobs' && (
          <JobsList onPayJob={handlePayJob} onStatsChange={fetchStats} />
        )}
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'services' && <ServiceManagement />}
        {activeTab === 'expenses' && <ExpenseManagement />}
        {activeTab === 'analytics' && <ProfitLossAnalytics />}
      </div>

      {/* Modals */}
      {showNewJobForm && (
        <NewJobForm
          onClose={() => setShowNewJobForm(false)}
          onJobCreated={handleJobCreated}
        />
      )}

      {showPaymentModal && selectedJob && (
        <PaymentModal
          job={selectedJob}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {showReceiptModal && selectedPayment && (
        <ReceiptModal
          payment={selectedPayment}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}