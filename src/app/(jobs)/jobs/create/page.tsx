'use client';

import JobForm from '@/components/jobs/JobForm';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
console.log('object from create: ', isAuthenticated, user);
  if (!isAuthenticated || user?.role !== 'employer') {
    router.push('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
        <JobForm />
      </div>
    </div>
  );
}