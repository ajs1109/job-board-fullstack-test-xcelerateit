import { User } from "./user";

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

// Example usage:
export type PublicUser = Without<User, 'password'>;