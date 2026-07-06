export interface Stats {
  totalLeads: number;
  totalCalls: number;
  fallbackCalls: number;
  activePros: number;
  totalRevenue: number;
}

export interface Pro {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  profession: string;
  pricePerLead: number;
  isActive: boolean;
  adminLocked: boolean;
  telegramChatId: string | null;
  createdAt: string;
  user: { email: string };
  _count: { leads: number; calls: number; landingPages: number };
}

export interface LandingPage {
  id: string;
  city: string;
  profession: string;
  twilioNumber: string;
  mainTitle: string;
  isDraft: boolean;
  createdAt: string;
  pro: { id: string; firstName: string; lastName: string; phone: string };
}

export interface Call {
  id: string;
  callerPhone: string;
  destinationPhone: string;
  duration: number;
  status: string;
  recordingUrl: string | null;
  type: "PHONE" | "WHATSAPP";
  proId: string | null;
  createdAt: string;
  pro: { firstName: string; lastName: string; phone: string; city: string; profession: string } | null;
}

export interface Lead {
  id: string;
  clientName: string;
  clientPhone: string;
  city: string;
  profession: string;
  status: string;
  proId: string | null;
  createdAt: string;
  pro: { firstName: string; lastName: string; phone: string; city: string; profession: string } | null;
}

export type Tab = "overview" | "pros" | "pages" | "traffic";
export type TrafficSub = "calls" | "leads";
