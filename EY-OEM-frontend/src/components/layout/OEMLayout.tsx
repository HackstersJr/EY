import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Car,
  Building2,
  ChevronDown,
  Settings,
  BarChart3,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { TimeRange, Region } from '@/lib/types';

interface OEMLayoutProps {
  children: ReactNode;
}

export const OEMLayout = ({ children }: OEMLayoutProps) => {
  const location = useLocation();
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [region, setRegion] = useState<Region>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/oem/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/oem/models', label: 'Models', icon: <Car className="w-5 h-5" /> },
    { to: '/oem/service-centers', label: 'Service Centers', icon: <Building2 className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/oem/dashboard') {
      return location.pathname === path || location.pathname === '/oem';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen theme-bg bg-mesh transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-oem-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/oem/dashboard" className="flex items-center gap-3 group">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-oem-blue-600 to-oem-teal-600 rounded-xl flex items-center justify-center shadow-glow-blue"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold gradient-text">OEM Control Center</span>
              </div>
            </Link>

            {/* Center - Navigation (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <motion.div
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${isActive(item.to)
                      ? 'bg-gradient-to-r from-oem-blue-600/20 to-oem-teal-600/20 text-oem-blue-400 ring-1 ring-oem-blue-500/30'
                      : 'text-oem-text-muted hover:text-white hover:bg-white/5'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Right - Filters & Settings */}
            <div className="flex items-center gap-3">
              {/* Time Range Filter */}
              <div className="relative hidden sm:block">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="select-primary bg-oem-medium-gray pr-10"
                >
                  <option value="7days" className="bg-oem-dark-gray">7 Days</option>
                  <option value="30days" className="bg-oem-dark-gray">30 Days</option>
                  <option value="90days" className="bg-oem-dark-gray">90 Days</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oem-text-muted pointer-events-none" />
              </div>

              {/* Region Filter */}
              <div className="relative hidden lg:block">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="select-primary bg-oem-medium-gray pr-10"
                >
                  <option value="All" className="bg-oem-dark-gray">All Regions</option>
                  <option value="North" className="bg-oem-dark-gray">North</option>
                  <option value="South" className="bg-oem-dark-gray">South</option>
                  <option value="East" className="bg-oem-dark-gray">East</option>
                  <option value="West" className="bg-oem-dark-gray">West</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oem-text-muted pointer-events-none" />
              </div>

              {/* Notification Icon */}
              <motion.button
                className="hidden sm:flex w-10 h-10 glass-card rounded-xl items-center justify-center hover:bg-white/10 transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-oem-text-muted" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-oem-rose-500 rounded-full text-[10px] font-bold flex items-center justify-center">3</span>
              </motion.button>

              {/* Settings Icon */}
              <motion.button
                className="hidden sm:flex w-10 h-10 glass-card rounded-xl items-center justify-center hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5 text-oem-text-muted" />
              </motion.button>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden w-10 h-10 glass-card rounded-xl flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-oem-text-muted" />
                ) : (
                  <Menu className="w-5 h-5 text-oem-text-muted" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-oem-border bg-oem-dark-gray/95 backdrop-blur-xl"
            >
              <div className="px-4 py-3 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div
                      className={`px-4 py-3 rounded-xl flex items-center gap-3 ${isActive(item.to)
                        ? 'bg-oem-blue-600/20 text-oem-blue-400'
                        : 'text-oem-text-muted'
                        }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                ))}

                {/* Mobile Filters */}
                <div className="pt-2 border-t border-oem-border flex gap-2">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    className="select-primary flex-1 text-sm"
                  >
                    <option value="7days">7 Days</option>
                    <option value="30days">30 Days</option>
                    <option value="90days">90 Days</option>
                  </select>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                    className="select-primary flex-1 text-sm"
                  >
                    <option value="All">All Regions</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Chat Widget with context */}
      <ChatWidget
        title="OEM AI Assistant"
        context={{
          timeRange,
          region,
        }}
      />
    </div>
  );
};
