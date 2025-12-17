import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomerVehicles } from '@/hooks/useCustomerVehicles';
import { useVehicleStatus } from '@/hooks/useVehicleStatus';
import { usePredictedIssues } from '@/hooks/usePredictedIssues';
import { CarViewer3D } from '@/components/three/CarViewer3D';
import { VehicleHealthCard } from '@/components/customer/VehicleHealthCard';
import { PredictedIssuesList } from '@/components/customer/PredictedIssuesList';
import { QuickActions } from '@/components/customer/QuickActions';
import { ChatWidget } from '@/components/chat/ChatWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export const DashboardPage = () => {
  const { data: vehicles } = useCustomerVehicles();
  const selectedVehicle = vehicles?.[0];

  const { data: vehicleStatus, isLoading: statusLoading } = useVehicleStatus(selectedVehicle?.id);
  const { data: predictedIssues, isLoading: issuesLoading } = usePredictedIssues(selectedVehicle?.id);

  const [chatVisible, setChatVisible] = useState(false);
  const [chatIssueId, setChatIssueId] = useState<string | undefined>();

  const handleAskAI = (issueId: string) => {
    setChatIssueId(issueId);
    setChatVisible(true);
  };

  const handleBookService = (issueId: string) => {
    console.log('Booking service for issue:', issueId);
    // TODO: Open booking modal
  };

  const handleOpenChat = () => {
    setChatIssueId(undefined);
    setChatVisible(true);
  };

  if (!selectedVehicle) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-tesla-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your vehicle...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section - Massive 3D Car */}
      <motion.section variants={itemVariants} className="relative mb-12">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-tesla-blue-500 rounded-full filter blur-[150px] opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-tesla-red-500 rounded-full filter blur-[150px] opacity-20 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Title overlay on 3D viewer */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-2">
                <span className="gradient-text">Porsche</span>{' '}
                <span className="text-white">911</span>
              </h1>
              <p className="text-xl text-gray-400 font-light tracking-wide">
                {selectedVehicle.registrationNumber} • {selectedVehicle.year}
              </p>
            </div>
            {vehicleStatus && (
              <div className="glass-card px-6 py-4 rounded-2xl">
                <div className="text-sm text-gray-400 mb-1">Overall Health</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-tesla-blue-400">{vehicleStatus.overallHealth}</span>
                  <span className="text-xl text-gray-500">%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3D Car Viewer - CENTER STAGE */}
        <div className="relative">
          <CarViewer3D />
        </div>
      </motion.section>

      {/* Stats Grid - Floating Glass Cards */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Vehicle Health Card */}
        <motion.div
          className="lg:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <VehicleHealthCard
            vehicleStatus={vehicleStatus}
            vehicleName={`${selectedVehicle.make} ${selectedVehicle.model}`}
            registrationNumber={selectedVehicle.registrationNumber}
            isLoading={statusLoading}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="lg:col-span-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <QuickActions onOpenChat={handleOpenChat} />
        </motion.div>
      </motion.section>

      {/* Predicted Issues - Full Width with Horizontal Layout */}
      <motion.section variants={itemVariants} className="mb-12">
        <PredictedIssuesList
          issues={predictedIssues}
          isLoading={issuesLoading}
          onAskAI={handleAskAI}
          onBookService={handleBookService}
        />
      </motion.section>

      {/* Floating stats bar */}
      {vehicleStatus && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem
              label="Total Mileage"
              value={vehicleStatus.mileage.toLocaleString()}
              unit="km"
              icon="🛣️"
            />
            <StatItem
              label="Battery Health"
              value={vehicleStatus.batteryHealth}
              unit="%"
              icon="🔋"
            />
            <StatItem
              label="Last Service"
              value={new Date(vehicleStatus.lastServiceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              unit=""
              icon="🔧"
            />
            <StatItem
              label="Next Service"
              value={new Date(vehicleStatus.nextRecommendedService).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              unit=""
              icon="📅"
              highlight
            />
          </div>
        </motion.div>
      )}

      {/* Chat Widget */}
      {chatVisible && (
        <ChatWidget
          vehicleId={selectedVehicle.id}
          issueId={chatIssueId}
        />
      )}
    </motion.div>
  );
};

const StatItem = ({
  label,
  value,
  unit,
  icon,
  highlight,
}: {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  highlight?: boolean;
}) => (
  <div className={`text-center ${highlight ? 'glass-strong p-4 rounded-xl' : ''}`}>
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-sm text-gray-400 mb-1">{label}</div>
    <div className="flex items-baseline justify-center gap-1">
      <span className={`text-2xl font-bold ${highlight ? 'gradient-text' : 'text-white'}`}>
        {value}
      </span>
      {unit && <span className="text-sm text-gray-500">{unit}</span>}
    </div>
  </div>
);
