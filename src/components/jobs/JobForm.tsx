'use client';

import { useForm } from 'react-hook-form';
import { CreateJob, Job } from '@/types/job';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createJob, updateJob } from '@/lib/api';
import { useState } from 'react';

interface JobFormProps {
  initialData?: Job;
}

export default function JobForm({ initialData }: JobFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateJob>({
    defaultValues: initialData || {
      title: '',
      description: '',
      location: '',
      skills: [],
    },
  });

  // Watch the skills array
  const skills = watch('skills');
  // State for the skills input field
  const [skillsInput, setSkillsInput] = useState(
    initialData?.skills?.join(', ') || ''
  );

  const router = useRouter();

  const onSubmit = async (data: CreateJob) => {
    try {
      if (initialData) {
        await updateJob(initialData.id.toString(), data);
        toast.success('Job updated successfully!');
      } else {
        await createJob(data);
        toast.success('Job created successfully!');
      }
      router.push('/jobs');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Convert comma-separated string to array and update form value
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillsInput(value);
    
    // Convert to array and trim whitespace
    const skillsArray = value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    setValue('skills', skillsArray, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          id="location"
          type="text"
          {...register('location', { required: 'Location is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.location && (
          <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Required Skills (comma separated)
        </label>
        <input
          id="skills"
          type="text"
          value={skillsInput}
          onChange={handleSkillsChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="JavaScript, React, Node.js"
        />
        {errors.skills && (
          <p className="mt-2 text-sm text-red-600">
            {typeof errors.skills === 'string' 
              ? errors.skills 
              : 'Please enter at least one skill'}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Current skills: {skills?.join(', ') || 'None'}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/jobs')}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}