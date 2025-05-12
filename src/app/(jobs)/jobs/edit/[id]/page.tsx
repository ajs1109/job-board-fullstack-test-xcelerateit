'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Job } from '@/types/job';
import JobForm from '@/components/jobs/JobForm';
import { useAuthStore } from '@/stores/authStore';
import { fetchJobById } from '@/lib/api';

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetchJobById(id?.toString() ?? '');
        setJob(response);
      } catch (error) {
        console.error('Error fetching job:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  if (!isAuthenticated || user?.role !== 'employer') {
    router.push('/');
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  if (job.employerId !== user?.id) {
    router.push('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>
        <JobForm initialData={job} />
      </div>
    </div>
  );
}