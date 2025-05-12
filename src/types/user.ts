export type UserRole = 'employer' | 'job_seeker';

export interface BaseUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Also create a type for user creation input
export interface CreateUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface User extends BaseUser {
  password?: string;  // Optional since we might not always need/want to expose this
}

export interface AuthUser extends BaseUser {
  token?: string;     // For authenticated user responses
}

export interface LoginInput extends Omit<User, 'id'>{
  
}