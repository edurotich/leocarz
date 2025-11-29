'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Analytics {
  totalRevenue: number;
  totalExpenses: number;
  totalCommissions: number;
  netProfit: number;
  isProfitable: boolean;
  expensesByCategory: { category: string; amount: number }[];
  revenueByPeriod: { date: string; amount: number }[];
}

export default function ProfitLossAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, startDate, endDate]);

  const getDateRange = () => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (dateRange) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'custom':
        if (startDate && endDate) {
          return {
            start: startDate,
            end: endDate
          };
        }
        break;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange();

      // Fetch total revenue from completed jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('car_wash_jobs')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('completed_at', start)
        .lte('completed_at', end);

      if (jobsError) throw jobsError;

      const totalRevenue = jobsData?.reduce((sum, job) => sum + Number(job.total_amount), 0) || 0;

      // Fetch total expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('car_wash_expenses')
        .select('amount, category')
        .gte('expense_date', start)
        .lte('expense_date', end);

      if (expensesError) throw expensesError;

      const totalExpenses = expensesData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

      // Group expenses by category
      const expensesByCategory = expensesData?.reduce((acc: any[], expense) => {
        const existing = acc.find(item => item.category === expense.category);
        if (existing) {
          existing.amount += Number(expense.amount);
        } else {
          acc.push({ category: expense.category, amount: Number(expense.amount) });
        }
        return acc;
      }, []) || [];

      // Fetch total commissions (paid and unpaid within date range)
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('car_wash_commissions')
        .select('commission_amount, created_at')
        .gte('created_at', start)
        .lte('created_at', end);

      if (commissionsError) throw commissionsError;

      const totalCommissions = commissionsData?.reduce((sum, commission) => sum + Number(commission.commission_amount), 0) || 0;

      // Calculate net profit (Revenue - Expenses - Commissions)
      const netProfit = totalRevenue - totalExpenses - totalCommissions;

      setAnalytics({
        totalRevenue,
        totalExpenses,
        totalCommissions,
        netProfit,
        isProfitable: netProfit > 0,
        expensesByCategory: expensesByCategory.sort((a, b) => b.amount - a.amount),
        revenueByPeriod: []
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    supplies: 'Supplies',
    utilities: 'Utilities',
    rent: 'Rent',
    equipment: 'Equipment',
    maintenance: 'Maintenance',
    salaries: 'Salaries',
    marketing: 'Marketing',
    other: 'Other'
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Profit & Loss Analytics</h2>
        <p className="text-gray-600">Financial performance overview</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Date Range</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setDateRange('today')}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange('custom')}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Custom Range
          </button>
        </div>

        {dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            KSh {analytics.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            KSh {analytics.totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Commissions</h3>
          <p className="text-3xl font-bold text-orange-600">
            KSh {analytics.totalCommissions.toLocaleString()}
          </p>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${
          analytics.isProfitable ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Net Profit/Loss</h3>
          <p className={`text-3xl font-bold ${
            analytics.isProfitable ? 'text-green-600' : 'text-red-600'
          }`}>
            {analytics.isProfitable ? '+' : ''}KSh {analytics.netProfit.toLocaleString()}
          </p>
          <p className={`text-sm mt-1 ${
            analytics.isProfitable ? 'text-green-600' : 'text-red-600'
          }`}>
            {analytics.isProfitable ? 'Profitable' : 'Loss'}
          </p>
        </div>
      </div>

      {/* Profit Margin */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Profit Margin Analysis</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Gross Revenue</span>
            <span className="font-semibold">KSh {analytics.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-red-600">
            <span>- Operating Expenses</span>
            <span className="font-semibold">KSh {analytics.totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-orange-600">
            <span>- Employee Commissions</span>
            <span className="font-semibold">KSh {analytics.totalCommissions.toLocaleString()}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Net Profit/Loss</span>
            <span className={`font-bold text-xl ${
              analytics.isProfitable ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.isProfitable ? '+' : ''}KSh {analytics.netProfit.toLocaleString()}
            </span>
          </div>
          {analytics.totalRevenue > 0 && (
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Profit Margin</span>
              <span>
                {((analytics.netProfit / analytics.totalRevenue) * 100).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expenses Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
        {analytics.expensesByCategory.length === 0 ? (
          <p className="text-gray-600">No expenses recorded in this period</p>
        ) : (
          <div className="space-y-3">
            {analytics.expensesByCategory.map((item) => {
              const percentage = analytics.totalExpenses > 0
                ? (item.amount / analytics.totalExpenses) * 100
                : 0;

              return (
                <div key={item.category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">
                      {categoryLabels[item.category] || item.category}
                    </span>
                    <span className="text-gray-900 font-semibold">
                      KSh {item.amount.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {!analytics.isProfitable && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ Action Required</h3>
          <p className="text-red-700 mb-2">
            Your car wash is currently operating at a loss. Consider:
          </p>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            <li>Reviewing and adjusting service pricing</li>
            <li>Reducing unnecessary expenses in high-cost categories</li>
            <li>Increasing customer volume through marketing</li>
            <li>Optimizing employee commission structure</li>
          </ul>
        </div>
      )}

      {analytics.isProfitable && analytics.netProfit < analytics.totalRevenue * 0.2 && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Optimization Tips</h3>
          <p className="text-yellow-700 mb-2">
            Your profit margin is below 20%. Consider:
          </p>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Negotiating better prices with suppliers</li>
            <li>Reducing waste and improving efficiency</li>
            <li>Introducing premium services with higher margins</li>
            <li>Reviewing utility costs and finding savings</li>
          </ul>
        </div>
      )}

      {analytics.isProfitable && analytics.netProfit >= analytics.totalRevenue * 0.2 && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Healthy Business</h3>
          <p className="text-green-700">
            Your car wash is performing well with a strong profit margin. Keep up the good work!
          </p>
        </div>
      )}
    </div>
  );
}
