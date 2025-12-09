import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Car,
    Factory,
    ChevronDown,
    Settings,
    Hexagon,
    Menu,
    X,
} from 'lucide-react';
import { ChatWidget } from '@/components/ChatWidget';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { TimeRange, Region } from '@/lib/types';

interface ManufacturerLayoutProps {
    children: ReactNode;
}

export const ManufacturerLayout = ({ children }: ManufacturerLayoutProps) => {
    const location = useLocation();
    const [timeRange, setTimeRange] = useState<TimeRange>('30days');
    const [region, setRegion] = useState<Region>('All');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { to: '/manufacturer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { to: '/manufacturer/models', label: 'Models', icon: <Car className="w-5 h-5" /> },
        { to: '/manufacturer/locations', label: 'Plants', icon: <Factory className="w-5 h-5" /> },
    ];

    const isActive = (path: string) => {
        if (path === '/manufacturer/dashboard') {
            return location.pathname === path || location.pathname === '/manufacturer';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen theme-bg bg-mesh transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-mfg-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/manufacturer/dashboard" className="flex items-center gap-3 group">
                            <motion.div
                                className="w-10 h-10 bg-gradient-to-br from-mfg-emerald-600 to-mfg-cyan-600 rounded-xl flex items-center justify-center shadow-glow-emerald"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <Hexagon className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold gradient-text">Manufacturing Quality Hub</span>
                            </div>
                        </Link>

                        {/* Center - Navigation (Desktop) */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link key={item.to} to={item.to}>
                                    <motion.div
                                        className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${isActive(item.to)
                                            ? 'bg-gradient-to-r from-mfg-emerald-600/20 to-mfg-cyan-600/20 text-mfg-emerald-400 ring-1 ring-mfg-emerald-500/30'
                                            : 'text-mfg-text-muted hover:text-white hover:bg-white/5'
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
                                    className="select-primary bg-mfg-medium-gray pr-10"
                                >
                                    <option value="30days" className="bg-mfg-dark-gray">30 Days</option>
                                    <option value="90days" className="bg-mfg-dark-gray">90 Days</option>
                                    <option value="180days" className="bg-mfg-dark-gray">180 Days</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mfg-text-muted pointer-events-none" />
                            </div>

                            {/* Region Filter */}
                            <div className="relative hidden lg:block">
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value as Region)}
                                    className="select-primary bg-mfg-medium-gray pr-10"
                                >
                                    <option value="All" className="bg-mfg-dark-gray">All Regions</option>
                                    <option value="North" className="bg-mfg-dark-gray">North</option>
                                    <option value="South" className="bg-mfg-dark-gray">South</option>
                                    <option value="East" className="bg-mfg-dark-gray">East</option>
                                    <option value="West" className="bg-mfg-dark-gray">West</option>
                                    <option value="Central" className="bg-mfg-dark-gray">Central</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mfg-text-muted pointer-events-none" />
                            </div>

                            {/* Settings Icon */}
                            <motion.button
                                className="hidden sm:flex w-10 h-10 glass-card rounded-xl items-center justify-center hover:bg-white/10 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Settings className="w-5 h-5 text-mfg-text-muted" />
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
                                    <X className="w-5 h-5 text-mfg-text-muted" />
                                ) : (
                                    <Menu className="w-5 h-5 text-mfg-text-muted" />
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
                            className="md:hidden border-t border-mfg-border bg-mfg-dark-gray/95 backdrop-blur-xl"
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
                                                ? 'bg-mfg-emerald-600/20 text-mfg-emerald-400'
                                                : 'text-mfg-text-muted'
                                                }`}
                                        >
                                            {item.icon}
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                    </Link>
                                ))}

                                {/* Mobile Filters */}
                                <div className="pt-2 border-t border-mfg-border flex gap-2">
                                    <select
                                        value={timeRange}
                                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                                        className="select-primary flex-1 text-sm"
                                    >
                                        <option value="30days">30 Days</option>
                                        <option value="90days">90 Days</option>
                                        <option value="180days">180 Days</option>
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
                                        <option value="Central">Central</option>
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
                title="Quality Assistant"
                context={{
                    timeRange,
                    region,
                }}
            />
        </div>
    );
};
