import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import TimeSlotGrid from '../components/features/booking/TimeSlotGrid';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

import { Input } from '../components/ui/Input';

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { doctors, bookAppointment } = useAppStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'review' | 'payment'>('review');
  const [isProcessing, setIsProcessing] = useState(false);

  const doctor = doctors.find(d => d.id === id);

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Doctor not found</h2>
        <Link to="/doctors">
          <Button className="mt-4">Back to listing</Button>
        </Link>
      </div>
    );
  }

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;
    setModalStep('review');
    setIsConfirmModalOpen(true);
  };

  const goToPayment = () => {
    setModalStep('payment');
  };

  const submitPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (!selectedDate || !selectedTime) return;
      
      bookAppointment({
        doctorId: doctor.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
      });
      
      setIsConfirmModalOpen(false);
      toast.success('Payment successful! Appointment confirmed.');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        to="/doctors" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Doctors</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info - Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 filter dark:brightness-90">
              <img 
                src={doctor.imageUrl} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{doctor.name}</h1>
            <p className="text-primary-600 dark:text-primary-400 font-medium">{doctor.specialization}</p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 shrink-0">
                  <Star size={20} className="fill-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white leading-none">{doctor.rating}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{doctor.reviewsCount} Reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white leading-none">{doctor.experience} Years</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Experience</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">About Doctor</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{doctor.bio}</p>
          </div>
        </div>

        {/* Booking slot - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Book Appointment</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Select an available date and time slot</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Consultation Fee</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{doctor.consultationFee}</p>
              </div>
            </div>

            <TimeSlotGrid
              doctor={doctor}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectDate={(date) => { setSelectedDate(date); setSelectedTime(null); }}
              onSelectTime={setSelectedTime}
            />

            <div className="mt-8">
              <Button 
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime}
                className="w-full text-lg h-14 rounded-2xl"
              >
                Proceed to Book
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Appointment"
      >
        <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
          {modalStep === 'review' ? (
            <>
              <div className="flex flex-col items-center justify-center text-center space-y-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                  <CheckCircle size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Review Details</h3>
                  <p className="text-slate-500 dark:text-slate-400">Please confirm your appointment details below</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 border-dashed">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Doctor</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{doctor.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 border-dashed">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Date</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedDate ? format(selectedDate, 'EEEE, MMM do yyyy') : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 border-dashed">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Time</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Fee</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">₹{doctor.consultationFee}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={goToPayment}>
                  Continue to Payment
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 dark:bg-slate-100 p-2 rounded-xl text-white dark:text-slate-900 shadow-sm">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Secure Checkout</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Consultation Payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AMOUNT DUE</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">₹{doctor.consultationFee}.00</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Payment Method</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold text-sm py-2.5 rounded-xl flex items-center justify-center cursor-pointer">
                    <CreditCard size={18} className="mr-2" /> Card
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm py-2.5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                    PayPal
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm py-2.5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                    Apple Pay
                  </div>
                </div>
              </div>

              {/* Unified Card Details */}
              <div className="pt-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Card Information</p>
                <div className="shadow-sm rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 transition-shadow">
                  <div className="relative">
                    <Input 
                      className="rounded-none border-b-slate-100 dark:border-b-slate-700 border-x-slate-200 dark:border-x-slate-700 border-t-slate-200 dark:border-t-slate-700 hover:border-slate-300 focus-visible:ring-0 shadow-none bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors" 
                      icon={<CreditCard size={18} />} 
                      placeholder="Card number" 
                      defaultValue="4242 4242 4242 4242"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                       <span className="bg-white dark:bg-slate-700 text-[10px] px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-600 shadow-sm">VISA</span>
                    </div>
                  </div>
                  <div className="flex">
                    <Input 
                      className="rounded-none border-r-slate-100 dark:border-r-slate-700 border-x-slate-200 dark:border-x-slate-700 border-b-slate-200 dark:border-b-slate-700 border-t-0 focus-visible:ring-0 shadow-none w-1/2 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors" 
                      placeholder="MM / YY" 
                      defaultValue="12/26"
                    />
                    <Input 
                      className="rounded-none border-l-0 border-x-slate-200 dark:border-x-slate-700 border-b-slate-200 dark:border-b-slate-700 border-t-0 focus-visible:ring-0 shadow-none w-1/2 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors" 
                      placeholder="CVC" 
                      type="password" 
                      defaultValue="123"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Name on card</label>
                  <Input 
                    className="rounded-xl shadow-sm bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 focus-visible:bg-white dark:focus-visible:bg-slate-800 transition-colors border-slate-200 dark:border-slate-700" 
                    placeholder="John Doe" 
                    defaultValue="John Doe"
                  />
                </div>
              </div>

              {/* Footer text */}
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/30 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 hidden sm:flex">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Lock size={14} className="text-slate-400 dark:text-slate-500" />
                  <span className="text-xs font-medium">Guaranteed Safe & Secure Checkout</span>
                </div>
                <div className="text-xs font-bold text-slate-300 dark:text-slate-600 italic tracking-wider uppercase">
                  Powered by <span className="text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600">Stripe</span> Mock
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setModalStep('review')} disabled={isProcessing}>
                  Back
                </Button>
                <Button onClick={submitPayment} disabled={isProcessing} className="w-full sm:w-56 font-bold shadow-md shadow-primary-500/20 text-base h-12">
                  {isProcessing ? (
                     <div className="flex items-center justify-center gap-2">
                       <div className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
                       <span>Processing...</span>
                     </div>
                  ) : (
                    `Pay ₹${doctor.consultationFee}.00`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
