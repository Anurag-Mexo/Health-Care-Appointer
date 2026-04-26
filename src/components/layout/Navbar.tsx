import { Link, useLocation } from 'react-router-dom';
import { Activity, CalendarDays, Users, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useAppStore();

  const links = [
    { name: 'Find Doctors', path: '/doctors', icon: Users },
    { name: 'My Dashboard', path: '/dashboard', icon: CalendarDays },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-xl text-white">
              <Activity size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              CareSync
            </span>
          </Link>
          
          <div className="flex gap-4 md:gap-8 items-center">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-600",
                    isActive ? "text-primary-600" : "text-slate-600"
                  )}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{link.name}</span>
                </Link>
              );
            })}

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-2" />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Button variant="outline" size="sm" className="hidden sm:flex rounded-full dark:border-slate-700 dark:text-slate-200">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
