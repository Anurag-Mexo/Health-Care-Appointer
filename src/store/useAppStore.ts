import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Doctor, Appointment, AppointmentStatus } from '../types';

interface AppState {
  doctors: Doctor[];
  appointments: Appointment[];
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  submitReview: (appointmentId: string, doctorId: string, rating: number) => void;
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiologist',
    experience: 15,
    rating: 4.9,
    reviewsCount: 128,
    availabilityStatus: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Dr. Jenkins is a board-certified cardiologist with over a decade of experience treating complex heart conditions. She believes in a patient-first approach to medicine.',
    consultationFee: 150,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    id: 'd2',
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    experience: 12,
    rating: 4.7,
    reviewsCount: 95,
    availabilityStatus: 'Busy',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Dr. Chen specializes in treating neurological disorders including migraines, epilepsy, and multiple sclerosis. He is actively involved in clinical research.',
    consultationFee: 200,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
  },
  {
    id: 'd3',
    name: 'Dr. Emily Peterson',
    specialization: 'Pediatrician',
    experience: 8,
    rating: 4.8,
    reviewsCount: 204,
    availabilityStatus: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1594824436998-d50d6ff71da2?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Dedicated pediatrician providing comprehensive care for infants, children, and adolescents. Dr. Peterson makes every visit comfortable and fun for kids.',
    consultationFee: 100,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  {
    id: 'd4',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedic Surgeon',
    experience: 20,
    rating: 4.6,
    reviewsCount: 156,
    availabilityStatus: 'Offline',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Expert in sports medicine and joint replacement surgeries. Dr. Wilson helps patients regain their mobility and return to their active lifestyles.',
    consultationFee: 250,
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
  },
  {
    id: 'd5',
    name: 'Dr. Anita Patel',
    specialization: 'Dermatologist',
    experience: 10,
    rating: 4.9,
    reviewsCount: 312,
    availabilityStatus: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Specializes in medical and cosmetic dermatology. Dr. Patel treats a wide range of skin conditions and offers personalized skin care regimens.',
    consultationFee: 120,
    availableDays: ['Monday', 'Tuesday', 'Friday', 'Saturday'],
  },
  {
    id: 'd6',
    name: 'Dr. Robert Fox',
    specialization: 'Psychiatrist',
    experience: 14,
    rating: 4.8,
    reviewsCount: 201,
    availabilityStatus: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Compassionate psychiatrist committed to mental wellness, specializing in anxiety and depression management.',
    consultationFee: 180,
    availableDays: ['Monday', 'Wednesday', 'Thursday'],
  },
  {
    id: 'd7',
    name: 'Dr. Olivia Martinez',
    specialization: 'Ophthalmologist',
    experience: 9,
    rating: 4.7,
    reviewsCount: 145,
    availabilityStatus: 'Busy',
    imageUrl: 'https://images.unsplash.com/photo-1594824436998-d50d6ff71da2?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Expert eye care professional, performing advanced laser eye surgeries and comprehensive eye exams.',
    consultationFee: 140,
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
  },
  {
    id: 'd8',
    name: 'Dr. William Kim',
    specialization: 'Dentist',
    experience: 6,
    rating: 4.9,
    reviewsCount: 432,
    availabilityStatus: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Family dentist dedicated to painless procedures and cosmetic dentistry for the perfect smile.',
    consultationFee: 80,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  {
    id: 'd9',
    name: 'Dr. Sophia Carter',
    specialization: 'General Practitioner',
    experience: 25,
    rating: 4.9,
    reviewsCount: 650,
    availabilityStatus: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Highly experienced general practitioner offering holistic family healthcare and preventative medicine.',
    consultationFee: 90,
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
  },
  {
    id: 'd10',
    name: 'Dr. David Lee',
    specialization: 'Cardiologist',
    experience: 11,
    rating: 4.6,
    reviewsCount: 110,
    availabilityStatus: 'Offline',
    imageUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Dedicated cardiologist with a special interest in sports cardiology and preventative heart healthy regimens.',
    consultationFee: 160,
    availableDays: ['Wednesday', 'Friday'],
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
      doctors: MOCK_DOCTORS,
      appointments: [],
      bookAppointment: (appointment) => set((state) => ({
        appointments: [
          ...state.appointments,
          {
            ...appointment,
            id: Math.random().toString(36).substring(2, 9),
            status: 'Upcoming' as AppointmentStatus
          }
        ]
      })),
      updateAppointmentStatus: (id, status) => set((state) => ({
        appointments: state.appointments.map(app => 
          app.id === id ? { ...app, status } : app
        )
      })),
      rescheduleAppointment: (id, newDate, newTime) => set((state) => ({
        appointments: state.appointments.map(app => 
          app.id === id ? { ...app, date: newDate, time: newTime } : app
        )
      })),
      submitReview: (appointmentId, doctorId, rating) => set((state) => ({
        doctors: state.doctors.map(doc => {
          if (doc.id === doctorId) {
            const newCount = doc.reviewsCount + 1;
            const newRating = ((doc.rating * doc.reviewsCount) + rating) / newCount;
            return { ...doc, rating: Number(newRating.toFixed(1)), reviewsCount: newCount };
          }
          return doc;
        }),
        appointments: state.appointments.map(app => 
          app.id === appointmentId ? { ...app, isReviewed: true } : app
        )
      }))
    }),
    {
      name: 'healthcare-storage',
    }
  )
);
