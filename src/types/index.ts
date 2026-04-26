export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number; // in years
  rating: number;
  reviewsCount: number;
  availabilityStatus: 'Available' | 'Busy' | 'Offline';
  imageUrl: string;
  bio: string;
  consultationFee: number;
  availableDays: string[];
}

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  doctorId: string;
  date: string; // ISO date format for the specific day
  time: string; // HH:mm format
  status: AppointmentStatus;
  isReviewed?: boolean;
}
