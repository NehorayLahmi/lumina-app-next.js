export interface Lead {
  id: string;
  clientName: string;
  clientPhone: string;
  city: string;
  profession: string;
  status: string;
  createdAt: string;
}

export interface Call {
  id: string;
  callerPhone: string;
  destinationPhone: string;
  duration: number;
  status: string;
  recordingUrl: string | null;
  createdAt: string;
}

export interface ProData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  profession: string;
  pricePerLead: number;
  isActive: boolean;
  adminLocked: boolean;
  telegramChatId?: string | null;
  user: { email: string };
  leads: Lead[];
  calls: Call[];
}

export type ActivityItem = ({ kind: "lead" } & Lead) | ({ kind: "call" } & Call);
export type Tab = "overview" | "activity" | "profile";
