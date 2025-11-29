'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashJobWithRelations, CarWashEmployee } from '@/types/database';

interface JobsListProps {
  onPayJob: (job: CarWashJobWithRelations) => void;
  onStatsChange: () => void;
}

export default function JobsList({ onPayJob, onStatsChange }: JobsListProps) {
  const [jobs, setJobs] = useState<CarWashJobWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('car_wash_jobs')
        .select(`
          *,
          employee:car_wash_employees(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      const updateData: any = { status };
      
      if (status === 'in_progress') {
        updateData.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('car_wash_jobs')
        .update(updateData)
        .eq('id', jobId);

      if (error) throw error;
      
      fetchJobs();
      onStatsChange();
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-slate-600">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Jobs', count: jobs.length },
          { key: 'pending', label: 'Pending', count: jobs.filter(j => j.status === 'pending').length },
          { key: 'in_progress', label: 'In Progress', count: jobs.filter(j => j.status === 'in_progress').length },
          { key: 'completed', label: 'Completed', count: jobs.filter(j => j.status === 'completed').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-500">
              {filter === 'all' ? 'No car wash jobs yet.' : `No ${filter.replace('_', ' ')} jobs.`}
            </p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-slate-50 rounded-lg border border-slate-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {job.job_number}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Customer</p>
                      <p className="font-medium text-slate-900">{job.customer_name}</p>
                      {job.customer_phone && (
                        <p className="text-slate-600">{job.customer_phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-slate-500">Vehicle</p>
                      <p className="font-medium text-slate-900">
                        {job.vehicle_make} {job.vehicle_model}
                      </p>
                      {job.vehicle_registration && (
                        <p className="text-slate-600">{job.vehicle_registration}</p>
                      )}
                      {job.vehicle_color && (
                        <p className="text-slate-600">{job.vehicle_color}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-slate-500">Employee</p>
                      <p className="font-medium text-slate-900">
                        {job.employee?.name || 'Unassigned'}
                      </p>
                      {job.employee?.employee_id && (
                        <p className="text-slate-600">{job.employee.employee_id}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span>Created: {formatDateTime(job.created_at)}</span>
                    {job.started_at && (
                      <span>Started: {formatDateTime(job.started_at)}</span>
                    )}
                    {job.completed_at && (
                      <span>Completed: {formatDateTime(job.completed_at)}</span>
                    )}
                  </div>

                  {/* Services */}
                  <div className="mt-3">
                    <p className="text-slate-500 text-sm mb-1">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {(job.services as any[])?.map((service, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                        >
                          {service.name} - {formatCurrency(service.price)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {job.notes && (
                    <div className="mt-3">
                      <p className="text-slate-500 text-sm">Notes:</p>
                      <p className="text-sm text-slate-700">{job.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(Number(job.total_amount))}
                    </p>
                    {job.discount > 0 && (
                      <p className="text-sm text-green-600">
                        Discount: -{formatCurrency(Number(job.discount))}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {job.status === 'pending' && (
                      <button
                        onClick={() => updateJobStatus(job.id, 'in_progress')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Job
                      </button>
                    )}
                    
                    {job.status === 'in_progress' && (
                      <button
                        onClick={() => updateJobStatus(job.id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                    
                    {job.status === 'completed' && (
                      <button
                        onClick={() => onPayJob(job)}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Process Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}