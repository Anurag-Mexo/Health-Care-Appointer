import { useState } from 'react';
import { Search, Filter, Stethoscope } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import DoctorCard from '../components/features/doctors/DoctorCard';

export default function DoctorListing() {
  const doctors = useAppStore((state) => state.doctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');

  const specializations = ['All', ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpec === 'All' || doctor.specialization === selectedSpec;
    
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/80 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
          <div className="bg-primary-100 dark:bg-primary-900/40 p-2.5 rounded-xl text-primary-600 dark:text-primary-400">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Find your specialist</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Book appointments with the best doctors.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <div className="flex-1">
            <Input 
              icon={<Search size={18} />} 
              placeholder="Search doctors by name or specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 relative">
            <select 
              className="h-11 w-full sm:w-48 appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Filter size={16} />
            </div>
          </div>
        </div>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No doctors found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">We couldn't find any doctors matching your search criteria. Try adjusting your filters.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => { setSearchTerm(''); setSelectedSpec('All'); }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
