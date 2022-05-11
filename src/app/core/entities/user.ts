
export interface User {
    blocked_at?: any;
  last_activity?: any;
  fullname?: any;
  name?: string;
  id?: number;
  lastname?: string;
  firstname?: string;
  address?: string;
  age?: number;
  phone?: string;
  isActive?: boolean;
  email?: string;
  avatar?: string;
  email_verified_at?: null;
  deleted_at?: null;
  created_at?: Date;
  updated_at?: Date;
  roles?: Role[];
  role?: string
}

export interface Role {
  id?: number;
  name?: string;
  description?: string;
  guard_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

