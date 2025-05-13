'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job } from '@/types/job';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { deleteJobById, fetchJobById } from '@/lib/api';
import { DottedSpinner } from '@/utils/customToast';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJobById(id?.toString() ?? '');
        toast.success('Job deleted successfully');
        router.push('/');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job');
      }
    }
  };

  if (loading) {
    return <div><DottedSpinner /></div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.location}</p>
          </div>
          {isAuthenticated && user?.id === job.employerId && (
            <div className="flex space-x-3">
              <Link
                href={`/jobs/edit/${job.id}`}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {job.description}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Required Skills</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Posted by</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {job.employer?.name}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}