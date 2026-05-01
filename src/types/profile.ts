export type UserRole = 'user' | 'landlord' | 'admin';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
