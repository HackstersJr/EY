import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCustomerVehicles } from '@/hooks/useCustomerVehicles';
import { useState } from 'react';
import { Car, Calendar, History, User, Menu, X, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header = () => {
  const location = useLocation();
  const { data: vehicles } = useCustomerVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles?.[0]?.id || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-hide header on scroll
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 24]);

  const navItems = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: <Car className="w-5 h-5" /> },
    { to: '/customer/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
    { to: '/customer/history', label: 'History', icon: <History className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/customer/dashboard') {
      return location.pathname === path || location.pathname === '/customer';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-customer-border"
      style={{
        opacity: headerOpacity,
        backdropFilter: useTransform(headerBlur, (value) => `blur(${value}px)`),
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link to="/customer/dashboard" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-tesla-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-glow-blue"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Car className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold gradient-text">Predictive</span>
              <span className="text-xl font-light text-white ml-2">Care</span>
            </div>
          </Link>

          {/* Center - Vehicle Selector (Desktop) */}
          <motion.div
            className="hidden md:flex glass-card px-5 py-2.5 rounded-xl items-center gap-3 min-w-[240px]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Car className="w-5 h-5 text-tesla-blue-400" />
            <select
              id="vehicle-select"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="flex-1 bg-transparent text-white font-medium focus:outline-none cursor-pointer text-sm"
            >
              {vehicles?.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id} className="bg-customer-dark-gray text-white">
                  {vehicle.make} {vehicle.model} • {vehicle.registrationNumber}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Right - Navigation Links & Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <motion.div
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${isActive(item.to)
                      ? 'bg-gradient-to-r from-tesla-blue-600/20 to-violet-600/20 text-tesla-blue-400 ring-1 ring-tesla-blue-500/30'
                      : 'text-customer-text-muted hover:text-white hover:bg-white/5'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Notification Bell */}
            <motion.button
              className="hidden sm:flex w-10 h-10 glass-card rounded-xl items-center justify-center hover:bg-white/10 transition-colors relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-customer-text-muted" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-tesla-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">2</span>
            </motion.button>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* User Avatar */}
            <motion.div
              className="hidden sm:flex items-center gap-3 cursor-pointer group pl-3 ml-2 border-l border-customer-border"
              whileHover={{ scale: 1.02 }}
            >
              <div className="glass-card w-10 h-10 rounded-full flex items-center justify-center group-hover:shadow-glow-blue transition-all">
                <User className="w-5 h-5 text-tesla-blue-400" />
              </div>
              <span className="text-sm font-medium text-white hidden lg:block">John Doe</span>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden w-10 h-10 glass-card rounded-xl flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-customer-text-muted" />
              ) : (
                <Menu className="w-5 h-5 text-customer-text-muted" />
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
            className="md:hidden border-t border-customer-border bg-customer-dark-gray/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-2">
              {/* Vehicle Selector */}
              <div className="glass-card p-3 rounded-xl flex items-center gap-3 mb-3">
                <Car className="w-5 h-5 text-tesla-blue-400" />
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="flex-1 bg-transparent text-white font-medium focus:outline-none cursor-pointer text-sm"
                >
                  {vehicles?.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id} className="bg-customer-dark-gray">
                      {vehicle.make} {vehicle.model} • {vehicle.registrationNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className={`px-4 py-3 rounded-xl flex items-center gap-3 ${isActive(item.to)
                      ? 'bg-tesla-blue-600/20 text-tesla-blue-400'
                      : 'text-customer-text-muted'
                      }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
