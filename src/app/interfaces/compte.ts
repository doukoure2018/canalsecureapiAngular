export interface Compte {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  phone?: string;
  password?: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  enabled?: boolean;
  nonLocked?: boolean;
  usingMfa?: boolean;
  createdAt?: Date;
  roleName?: string;
  permissions?: string;
}
