'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchAllJobs } from '@/lib/api';
import Link from 'next/link';
import { Job } from '@/types/job';
import { useAuthStore } from '@/stores/authStore';
import { Search } from 'lucide-react';
import { DottedSpinner } from '@/utils/customToast';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetchAllJobs();
        setJobs(response);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;

    const query = searchQuery.toLowerCase();
    return jobs.filter(job => {
      return (
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    });
  }, [jobs, searchQuery]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><DottedSpinner /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative rounded-md shadow-sm w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button title="Search for jobs" type='button'
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {isAuthenticated && user?.role === 'employer' && (
            <Link
              href="/jobs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
            >
              Post a Job
            </Link>
          )}
        </div>
      </div>

      {filteredJobs && filteredJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{job.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{job.location}</p>
                  </div>
                  {isAuthenticated && user?.id === job.employerId && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Your Job
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">{job.description}</p>
                <div className="mt-4">
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
                </div>
                <div className="mt-6">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-8 text-center">
          <div className="mx-auto max-w-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchQuery ? 'No matching jobs found' : 'No jobs found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'There are currently no job listings available. Please check back later.'}
            </p>
            {isAuthenticated && user?.role === 'employer' && (
              <div className="mt-6">
                <Link
                  href="/jobs/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Post the first job
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}