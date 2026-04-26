import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Doctor } from '../../../types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const statusColor = {
    Available: 'success',
    Busy: 'warning',
    Offline: 'default'
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-xl dark:hover:shadow-primary-900/20 transition-all duration-300"
    >
      <div className="p-5">
        <div className="flex gap-4 items-start">
          <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-slate-50 dark:ring-slate-900">
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-1 right-1">
              <Badge variant={statusColor[doctor.availabilityStatus]} className="scale-75 origin-bottom-right">
                {doctor.availabilityStatus}
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{doctor.name}</h3>
            <p className="text-secondary-600 dark:text-secondary-400 font-medium text-sm">{doctor.specialization}</p>
            
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 dark:text-amber-500 fill-amber-400 dark:fill-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{doctor.rating}</span>
                <span>({doctor.reviewsCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{doctor.experience} Yrs Exp.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Consultation Fee</span>
            <p className="font-bold text-slate-900 dark:text-white text-lg">₹{doctor.consultationFee}</p>
          </div>
          <Link to={`/doctors/${doctor.id}`}>
            <Button size="sm">Book Visit</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
