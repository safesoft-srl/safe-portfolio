export interface User {
  id?: string | number;
  name?: string;
  username?: string;
  email?: string;
  role?: 'user' | 'admin';
  permissions?: string[];
  verified?: boolean;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}
