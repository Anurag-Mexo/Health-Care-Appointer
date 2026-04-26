import { useState } from 'react';
import { Calendar, Clock, MapPin, MoreVertical, CheckCircle2, XCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import TimeSlotGrid from '../components/features/booking/TimeSlotGrid';
import type { Appointment } from '../types';

export default function Dashboard() {
  const { appointments, doctors, updateAppointmentStatus, rescheduleAppointment, submitReview } = useAppStore();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  
  // Reschedule State
  const [rescheduleData, setRescheduleData] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newTime, setNewTime] = useState<string | null>(null);

  // Review State
  const [reviewData, setReviewData] = useState<Appointment | null>(null);
  const [rating, setRating] = useState<number>(0);

  const upcoming = appointments.filter(a => a.status === 'Upcoming');
  const past = appointments.filter(a => a.status !== 'Upcoming');

  const displayList = activeTab === 'Upcoming' ? upcoming : past;

  const handleCancel = (id: string) => {
    updateAppointmentStatus(id, 'Cancelled');
    toast.success('Appointment cancelled successfully.');
  };

  const openReschedule = (app: Appointment) => {
    setRescheduleData(app);
    setNewDate(null);
    setNewTime(null);
  };

  const confirmReschedule = () => {
    if (!rescheduleData || !newDate || !newTime) return;
    rescheduleAppointment(
      rescheduleData.id,
      format(newDate, 'yyyy-MM-dd'),
      newTime
    );
    setRescheduleData(null);
    toast.success('Appointment rescheduled successfully.');
  };

  const handleComplete = (id: string) => {
    updateAppointmentStatus(id, 'Completed');
    toast.success('Appointment marked as completed.');
  };

  const openReview = (app: Appointment) => {
    setReviewData(app);
    setRating(0);
  };

  const confirmReview = () => {
    if (!reviewData || rating === 0) return;
    submitReview(reviewData.id, reviewData.doctorId, rating);
    setReviewData(null);
    toast.success('Review submitted successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your appointments</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 flex gap-6 px-6 pt-4">
          <button
            onClick={() => setActiveTab('Upcoming')}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === 'Upcoming' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Upcoming
            {upcoming.length > 0 && (
              <span className="ml-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 py-0.5 px-2 rounded-full text-xs">
                {upcoming.length}
              </span>
            )}
            {activeTab === 'Upcoming' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-500 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('Past')}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === 'Past' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Past & Cancelled
            {activeTab === 'Past' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-500 rounded-t-full" />
            )}
          </button>
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 min-h-[400px]">
          {displayList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-slate-400 dark:text-slate-500 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No {activeTab.toLowerCase()} appointments</h3>
              <p className="text-slate-500 dark:text-slate-400">You don't have any {activeTab.toLowerCase()} appointments at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {displayList.map(app => {
                const doctor = doctors.find(d => d.id === app.doctorId);
                if (!doctor) return null;

                const statusColors = {
                  Upcoming: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
                  Completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
                  Cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
                };

                return (
                  <div key={app.id} className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <img src={doctor.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-50 dark:ring-slate-800" />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{doctor.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{doctor.specialization}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                        <span>{format(parseISO(app.date), 'EEEE, MMM do yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Clock size={16} className="text-slate-400 dark:text-slate-500" />
                        <span>{app.time}</span>
                      </div>
                    </div>

                    {app.status === 'Upcoming' && (
                      <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Button 
                          variant="ghost" 
                          className="px-2 border border-slate-200 dark:border-slate-700"
                          onClick={() => handleCancel(app.id)}
                        >
                          <XCircle size={18} className="text-red-500" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 text-sm bg-white dark:bg-transparent"
                          onClick={() => openReschedule(app)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          className="flex-1 text-sm bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white border-0"
                          onClick={() => handleComplete(app.id)}
                        >
                          Check In
                        </Button>
                      </div>
                    )}
                    {app.status === 'Completed' && !app.isReviewed && (
                      <div className="flex pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Button 
                          className="w-full text-sm"
                          onClick={() => openReview(app)}
                        >
                          Leave a Review
                        </Button>
                      </div>
                    )}
                    {app.status === 'Completed' && app.isReviewed && (
                      <div className="flex pt-4 border-t border-slate-100 dark:border-slate-700 justify-center">
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                          <CheckCircle2 size={16} /> Reviewed
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!rescheduleData}
        onClose={() => setRescheduleData(null)}
        title="Reschedule Appointment"
      >
        <div className="py-2">
          {rescheduleData && doctors.find(d => d.id === rescheduleData.doctorId) && (
            <TimeSlotGrid
              doctor={doctors.find(d => d.id === rescheduleData.doctorId)!}
              selectedDate={newDate}
              selectedTime={newTime}
              onSelectDate={(date) => { setNewDate(date); setNewTime(null); }}
              onSelectTime={setNewTime}
            />
          )}

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setRescheduleData(null)}>
              Cancel
            </Button>
            <Button onClick={confirmReschedule} disabled={!newDate || !newTime}>
              Confirm New Time
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={!!reviewData}
        onClose={() => setReviewData(null)}
        title="Leave a Review"
      >
        <div className="py-4 space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            How was your appointment with <span className="font-bold text-slate-900 dark:text-white">{reviewData ? doctors.find(d => d.id === reviewData.doctorId)?.name : ''}</span>?
          </p>
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  size={40} 
                  className={rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'} 
                />
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setReviewData(null)}>
              Cancel
            </Button>
            <Button onClick={confirmReview} disabled={rating === 0}>
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
