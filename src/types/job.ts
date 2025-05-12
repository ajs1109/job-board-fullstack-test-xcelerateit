import { BaseUser } from './user';

export interface BaseJob {
  id: number;
  title: string;
  description: string;
  location: string;
  skills: string[];
  employerId: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Job extends BaseJob {
  employer?: BaseUser; // Expanded relationship
}

// For job creation (frontend form/API payload)
export type CreateJob = Omit<BaseJob, 'id' | 'createdAt' | 'updatedAt'>;

// For job updates
export type UpdateJob = Partial<CreateJob>;

// For API responses
export interface JobResponse extends BaseJob {
  employer?: BaseUser;
}

// For paginated job listings
export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}