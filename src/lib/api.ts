import { CreateJob } from '@/types/job';
import { User, UserRole } from '@/types/user';
import { apiService } from '@/utils/apiService';

export const loginUser = async (email: string, password: string): Promise<{message:string, user?:User, token?: string}> => {
  try {
    const data = await apiService.post<{message:string, user?:User}>('/auth/login', {email, password});
    return data;
  } catch (error) {
    throw error;
  }
}
export const registerUser = async (name: string, email: string, password: string, role: UserRole): Promise<{message:string, user?:User, token?: string}> => {
  try {
    const data = await apiService.post<{message:string, user?:User}>('/auth/register', {name, email, password, role});
    return data;
  } catch (error) {
    throw error;
  }
}

export const verifyUser = async (token: string): Promise<{message:string, user?:User}> => {
  try {
    const data = await apiService.post<{message:string, user?:User}>('/auth/verify', {token});
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllJobs = async (): Promise<any> => {
  try {
    const data = await apiService.get('/jobs');
    return data;
  } catch (error) {
    throw error;
  }
}

export const createJob = async (jobData: CreateJob): Promise<any> => {
  try {
    const data = await apiService.post('/jobs', jobData);
    return data;
  } catch (error) {
    throw error;
  }
}

export const fetchJobById = async (jobId: string): Promise<any> => {
  try {
    const data = await apiService.get(`/jobs/${jobId}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export const deleteJobById = async (jobId: string): Promise<any> => {
  try {
    const data = await apiService.delete(`/jobs/${jobId}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export const updateJob = async (jobId: string, jobData: CreateJob): Promise<any> => {
  try {
    const data = await apiService.put(`/jobs/${jobId}`, jobData);
    return data;
  } catch (error) {
    throw error;
  }
}