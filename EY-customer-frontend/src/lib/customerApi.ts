import type {
  Vehicle,
  VehicleStatus,
  PredictedIssue,
  Complaint,
  CreateComplaintInput,
  Appointment,
  CreateAppointmentInput,
  ServiceCenter,
  ServiceRecord,
  ChatInput,
  ChatResponse,
  TimeSlot,
} from './types';

// Mock data
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    model: '911 Carrera 4S',
    make: 'Porsche',
    year: 2022,
    registrationNumber: 'KA-01-AB-1234',
    vin: 'WP0AB2A91NS123456',
    customerId: 'cust-001',
  },
  {
    id: 'veh-002',
    model: 'Cayenne',
    make: 'Porsche',
    year: 2021,
    registrationNumber: 'KA-02-CD-5678',
    vin: 'WP1AA2AY0PDA12345',
    customerId: 'cust-001',
  },
];

const MOCK_VEHICLE_STATUS: Record<string, VehicleStatus> = {
  'veh-001': {
    vehicleId: 'veh-001',
    overallHealth: 87,
    mileage: 45230,
    lastServiceDate: '2024-09-15',
    nextRecommendedService: '2025-03-15',
    batteryHealth: 92,
    engineHealth: 88,
    brakeHealth: 85,
    suspensionHealth: 90,
  },
};

const MOCK_PREDICTED_ISSUES: Record<string, PredictedIssue[]> = {
  'veh-001': [
    {
      id: 'issue-001',
      vehicleId: 'veh-001',
      componentName: 'Front Brake Pads',
      componentId: 'front-brakes',
      probability: 78,
      severity: 'Medium',
      description: 'Brake pads showing signs of wear. Recommended replacement within 2 months.',
      recommendedServiceWindow: 'Within 60 days',
      estimatedCost: 350,
      predictedDate: '2025-02-07',
    },
    {
      id: 'issue-002',
      vehicleId: 'veh-001',
      componentName: 'Battery Pack',
      componentId: 'battery',
      probability: 45,
      severity: 'Low',
      description: 'Minor degradation detected in battery cells. Monitor performance.',
      recommendedServiceWindow: 'Within 6 months',
      estimatedCost: 0,
    },
    {
      id: 'issue-003',
      vehicleId: 'veh-001',
      componentName: 'Suspension System',
      componentId: 'suspension',
      probability: 62,
      severity: 'Medium',
      description: 'Shock absorbers may need attention. Schedule inspection.',
      recommendedServiceWindow: 'Within 90 days',
      estimatedCost: 600,
      predictedDate: '2025-03-07',
    },
  ],
};

const MOCK_SERVICE_CENTERS: ServiceCenter[] = [
  {
    id: 'sc-001',
    name: 'Porsche Centre Bangalore',
    address: '123 Outer Ring Road, Bangalore, KA 560103',
    phone: '+91 80 1234 5678',
    availableServices: ['Maintenance', 'Repairs', 'Diagnostics', 'Performance Tuning'],
  },
  {
    id: 'sc-002',
    name: 'Premium Auto Care - Koramangala',
    address: '456 Koramangala, Bangalore, KA 560034',
    phone: '+91 80 8765 4321',
    availableServices: ['Maintenance', 'Repairs', 'Tire Service'],
  },
  {
    id: 'sc-003',
    name: 'Porsche Approved Service - Whitefield',
    address: '789 Whitefield Main Rd, Bangalore, KA 560066',
    phone: '+91 80 9876 5432',
    availableServices: ['Performance Service', 'Diagnostics', 'Software Updates'],
  },
];

let mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    vehicleId: 'veh-001',
    customerId: 'cust-001',
    serviceCenterId: 'sc-001',
    serviceCenter: MOCK_SERVICE_CENTERS[0],
    date: '2025-01-15',
    timeSlot: '10:00 AM - 11:00 AM',
    status: 'Scheduled',
    serviceType: 'Routine Maintenance',
    createdAt: '2024-12-01T10:00:00Z',
  },
];

let mockComplaints: Complaint[] = [];

const MOCK_SERVICE_HISTORY: Record<string, ServiceRecord[]> = {
  'veh-001': [
    {
      id: 'srv-001',
      vehicleId: 'veh-001',
      serviceCenterId: 'sc-001',
      serviceCenter: MOCK_SERVICE_CENTERS[0],
      date: '2024-09-15',
      serviceType: 'Annual Maintenance',
      description: 'Full vehicle inspection, brake fluid replacement, tire rotation',
      cost: 8500,
      mileageAtService: 40000,
      partsReplaced: ['Brake Fluid', 'Air Filter'],
      technician: 'Rajesh Kumar',
    },
    {
      id: 'srv-002',
      vehicleId: 'veh-001',
      serviceCenterId: 'sc-001',
      serviceCenter: MOCK_SERVICE_CENTERS[0],
      date: '2024-03-20',
      serviceType: 'Battery Check',
      description: 'Battery health diagnostic and software update',
      cost: 2000,
      mileageAtService: 35000,
      technician: 'Priya Sharma',
    },
  ],
};

// API Functions with mock implementations

export const getCustomerVehicles = async (): Promise<Vehicle[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_VEHICLES;
};

export const getVehicleStatus = async (vehicleId: string): Promise<VehicleStatus> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const status = MOCK_VEHICLE_STATUS[vehicleId];
  if (!status) {
    throw new Error('Vehicle status not found');
  }
  return status;
};

export const getPredictedIssues = async (vehicleId: string): Promise<PredictedIssue[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_PREDICTED_ISSUES[vehicleId] || [];
};

export const getCustomerAppointments = async (vehicleId: string): Promise<Appointment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAppointments.filter((apt) => apt.vehicleId === vehicleId);
};

export const getServiceCenters = async (): Promise<ServiceCenter[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_SERVICE_CENTERS;
};

export const getAvailableTimeSlots = async (
  _serviceCenterId: string,
  _date: string
): Promise<TimeSlot[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Generate mock time slots
  const slots: TimeSlot[] = [
    { id: 'slot-1', time: '09:00 AM - 10:00 AM', available: true },
    { id: 'slot-2', time: '10:00 AM - 11:00 AM', available: true },
    { id: 'slot-3', time: '11:00 AM - 12:00 PM', available: false },
    { id: 'slot-4', time: '02:00 PM - 03:00 PM', available: true },
    { id: 'slot-5', time: '03:00 PM - 04:00 PM', available: true },
    { id: 'slot-6', time: '04:00 PM - 05:00 PM', available: false },
  ];

  return slots;
};

export const createAppointment = async (
  input: CreateAppointmentInput
): Promise<Appointment> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const serviceCenter = MOCK_SERVICE_CENTERS.find((sc) => sc.id === input.serviceCenterId);

  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    vehicleId: input.vehicleId,
    customerId: 'cust-001',
    serviceCenterId: input.serviceCenterId,
    serviceCenter,
    date: input.date,
    timeSlot: input.timeSlot,
    status: 'Scheduled',
    issueId: input.issueId,
    serviceType: input.serviceType,
    notes: input.notes,
    createdAt: new Date().toISOString(),
  };

  mockAppointments.push(newAppointment);
  return newAppointment;
};

export const createComplaint = async (
  input: CreateComplaintInput
): Promise<Complaint> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newComplaint: Complaint = {
    id: `cmp-${Date.now()}`,
    vehicleId: input.vehicleId,
    customerId: 'cust-001',
    affectedPart: input.affectedPart,
    symptomCategory: input.symptomCategory,
    description: input.description,
    whenOccurs: input.whenOccurs,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockComplaints.push(newComplaint);
  return newComplaint;
};

export const getServiceHistory = async (vehicleId: string): Promise<ServiceRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_SERVICE_HISTORY[vehicleId] || [];
};

export const sendCustomerChatMessage = async (
  input: ChatInput
): Promise<ChatResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate contextual mock response based on the message
  let responseText = '';
  const lowerMessage = input.message.toLowerCase();

  if (input.issueId) {
    const issue = MOCK_PREDICTED_ISSUES[input.vehicleId]?.find((i) => i.id === input.issueId);
    if (issue) {
      responseText = `I can help you with the ${issue.componentName} issue. Based on our analysis, there's a ${issue.probability}% probability that this component may need attention. The severity is ${issue.severity}. ${issue.description} I recommend scheduling a service appointment within the suggested timeframe. Would you like me to help you book an appointment?`;
    }
  } else if (lowerMessage.includes('brake')) {
    responseText = 'I see you\'re asking about brakes. Your front brake pads are showing some wear and we predict they may need replacement within 60 days. This is a medium severity issue with 78% probability. Would you like to schedule a brake inspection?';
  } else if (lowerMessage.includes('battery')) {
    responseText = 'Your battery pack is in good condition with 92% health. We\'ve detected minor degradation which is normal for a vehicle of this age. Continue monitoring, and we\'ll alert you if any action is needed. Your next battery check is recommended in 6 months.';
  } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
    responseText = 'I can help you book a service appointment. We have availability at Porsche Centre Bangalore and other partner locations. What type of service do you need, and when would you prefer to visit?';
  } else if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    responseText = 'Based on your predicted maintenance items: Front brake pad replacement is estimated at ₹350, and suspension inspection at ₹600. These are estimates and actual costs may vary based on the final diagnosis. Would you like to schedule an inspection?';
  } else {
    responseText = 'I\'m your AI vehicle assistant. I can help you with information about your vehicle health, predicted maintenance issues, service history, and booking appointments. How can I assist you today?';
  }

  return {
    message: responseText,
    timestamp: new Date().toISOString(),
    suggestedActions: ['Book Appointment', 'View Details', 'Contact Support'],
  };
};
