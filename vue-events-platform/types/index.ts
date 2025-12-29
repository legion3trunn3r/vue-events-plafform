export interface User {
  id: number;
  email: string;
  name: string;
  role: 'client' | 'admin';
  password?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  role?: 'client' | 'admin';
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  max_guests: number;
  organizer_id: number;
  qr_code: string;
  created_at: Date;
  updated_at: Date;
  organizer?: User;
  photos?: EventPhoto[];
  guest_count?: number;
}

export interface EventCreation {
  title: string;
  description: string;
  date: string;
  location: string;
  max_guests: number;
}

export interface EventPhoto {
  id: number;
  event_id: number;
  photo_url: string;
  uploaded_by: number;
  created_at: Date;
  uploaded_by_user?: User;
}

export interface Guest {
  id: number;
  event_id: number;
  name: string;
  email: string;
  qr_checked: boolean;
  checked_in_at?: Date;
  created_at: Date;
}

export interface GuestRegistration {
  name: string;
  email: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
