import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type Booking = {
  id: string;
  zone: string;
  date: string;
  time_slot: string;
  student_name: string;
  class_name: string;
  status: BookingStatus;
  created_at: string;
};

export type EquipmentRequestStatus = 'pending' | 'approved' | 'issued' | 'rejected';

export type EquipmentRequest = {
  id: string;
  equipment_id: string;
  equipment_name: string;
  purpose: string;
  student_name: string;
  class_name: string;
  status: EquipmentRequestStatus;
  created_at: string;
};
