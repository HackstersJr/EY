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
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// MOCK DATA (Kept for non-agent endpoints)
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
    id: 'e9cdfa2a-91ac-4c2e-975e-33a3ca1f8eb5', // Valid ID from DB
    model: 'Cayenne',
    make: 'Porsche',
    year: 2021,
    registrationNumber: 'KA-02-CD-5678',
    vin: 'WP1AA2AY0PDA12345',
    customerId: 'cust-001',
  },
];

const MOCK_SERVICE_CENTERS: ServiceCenter[] = [
  {
    id: 'CENTER-1',
    name: 'Porsche Centre Bangalore',
    address: '123 Outer Ring Road, Bangalore, KA 560103',
    phone: '+91 80 1234 5678',
    availableServices: ['Maintenance', 'Repairs', 'Diagnostics', 'Performance Tuning'],
  },
  {
    id: 'CENTER-2',
    name: 'Premium Auto Care - Koramangala',
    address: '456 Koramangala, Bangalore, KA 560034',
    phone: '+91 80 8765 4321',
    availableServices: ['Maintenance', 'Repairs', 'Tire Service'],
  },
  {
    id: 'CENTER-3',
    name: 'Porsche Approved Service - Whitefield',
    address: '789 Whitefield Main Rd, Bangalore, KA 560066',
    phone: '+91 80 9876 5432',
    availableServices: ['Performance Service', 'Diagnostics', 'Software Updates'],
  },
];

let mockAppointments: Appointment[] = [];
let mockComplaints: Complaint[] = [];

// API Functions

export const getCustomerVehicles = async (): Promise<Vehicle[]> => {
  // Mock - No agent for vehicle list yet
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_VEHICLES;
};

export const getVehicleStatus = async (vehicleId: string): Promise<VehicleStatus> => {
  try {
    // Call Data Analysis Agent
    const response = await axios.post(`${BASE_URL}/agent/analysis`, {
      vehicle_id: vehicleId,
    });

    const data = response.data; // Expects { health_score, analysis_summary, ... }

    // Map Agent response to VehicleStatus
    return {
      vehicleId: vehicleId,
      overallHealth: data.health_score || 85, // Use agent score or default
      mileage: 45230, // Mock
      lastServiceDate: '2024-09-15', // Mock
      nextRecommendedService: '2025-03-15', // Mock
      batteryHealth: 92, // Mock 
      engineHealth: data.health_score || 88, // Link to overall health
      brakeHealth: 85,
      suspensionHealth: 90,
    };
  } catch (error) {
    console.error("Analysis Agent Error:", error);
    // Fallback to mock if agent fails or returns unknown
    return {
      vehicleId: vehicleId,
      overallHealth: 87,
      mileage: 45230,
      lastServiceDate: '2024-09-15',
      nextRecommendedService: '2025-03-15',
      batteryHealth: 92,
      engineHealth: 88,
      brakeHealth: 85,
      suspensionHealth: 90,
    };
  }
};

export const getPredictedIssues = async (vehicleId: string): Promise<PredictedIssue[]> => {
  try {
    // Call Data Analysis Agent
    const response = await axios.post(`${BASE_URL}/agent/analysis`, {
      vehicle_id: vehicleId,
    });

    const data = response.data;
    const issues: PredictedIssue[] = [];

    if (data.analysis_summary) {
      issues.push({
        id: `issue-${Date.now()}`,
        vehicleId: vehicleId,
        componentName: 'AI Diagnosis',
        componentId: 'ai-diag',
        probability: 90,
        severity: data.health_score < 70 ? 'High' : 'Medium',
        description: data.analysis_summary,
        recommendedServiceWindow: 'Within 30 days',
        estimatedCost: 500,
        predictedDate: new Date().toISOString()
      });
    }
    return issues;

  } catch (error) {
    console.error("Analysis Agent Error:", error);
    return [];
  }
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
  return [
    { id: 'slot-1', time: '09:00 AM - 10:00 AM', available: true },
    { id: 'slot-2', time: '10:00 AM - 11:00 AM', available: true },
    { id: 'slot-3', time: '11:00 AM - 12:00 PM', available: false },
    { id: 'slot-4', time: '02:00 PM - 03:00 PM', available: true },
    { id: 'slot-5', time: '03:00 PM - 04:00 PM', available: true },
  ];
};

export const createAppointment = async (
  input: CreateAppointmentInput
): Promise<Appointment> => {
  try {
    // Call Scheduling Agent
    const response = await axios.post(`${BASE_URL}/agent/scheduling`, {
      user_id: 'cust-001', // Hardcoded for now, or get from context
      vehicle_id: input.vehicleId,
      preferred_date: input.date,
      service_center_id: input.serviceCenterId
    });

    // Agent returns { success: true, appointment_id: ..., confirmation_code: ... }
    const success = response.data.success || response.data.json?.success;

    if (success) {
      const newAppointment: Appointment = {
        id: response.data.appointment_id || response.data.json?.appointment_id || `apt-${Date.now()}`,
        vehicleId: input.vehicleId,
        customerId: 'cust-001',
        serviceCenterId: input.serviceCenterId,
        serviceCenter: MOCK_SERVICE_CENTERS.find(s => s.id === input.serviceCenterId),
        date: input.date,
        timeSlot: input.timeSlot,
        status: 'Confirmed', // Agent marks it as CONFIRMED
        serviceType: input.serviceType,
        notes: input.notes,
        createdAt: new Date().toISOString(),
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    } else {
      throw new Error(response.data.message || "Failed to schedule appointment");
    }

  } catch (error) {
    console.error("Scheduling Agent Error:", error);
    throw error;
  }
};

export const createComplaint = async (
  input: CreateComplaintInput
): Promise<Complaint> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Mock logic
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

export const getServiceHistory = async (_vehicleId: string): Promise<ServiceRecord[]> => {
  // Can be enhanced to fetch from DB if backend supports it
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [];
};

export const sendCustomerChatMessage = async (
  input: ChatInput
): Promise<ChatResponse> => {
  try {
    // Call Customer Engagement Agent
    const response = await axios.post(`${BASE_URL}/agent/chat`, {
      query: input.message,
      context: {
        user_id: 'cust-001',
        vehicle_id: input.vehicleId
      }
    });

    // Backend returns: { response: "AI Message" } (from n8n structure)
    return {
      message: response.data.response || "I didn't understand that.",
      timestamp: new Date().toISOString(),
      suggestedActions: ['Book Appointment', 'View Details']
    };

  } catch (error) {
    console.error("Chat Agent Error:", error);
    return {
      message: "I'm having trouble connecting to the network.",
      timestamp: new Date().toISOString(),
      suggestedActions: []
    };
  }
};
