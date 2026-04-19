export interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes: Note[];
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export type CustomerStatus = "lead" | "customer" | "inactive";

export const INDUSTRIES = [
  "IT & Software",
  "Retail",
  "Manufacturing",
  "Services",
  "Finance",
  "Healthcare",
  "Logistics",
  "Real Estate",
  "Marketing",
  "Other",
] as const;

export type Industry = typeof INDUSTRIES[number];

export const PRESET_TAGS = ["VIP", "Key Account", "Partner", "Prospect", "Reseller"] as const;

export const TAG_COLORS: Record<string, string> = {
  "VIP":         "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Key Account": "bg-cyber-accent/15 text-cyber-accent border-cyber-accent/30",
  "Partner":     "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Prospect":    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Reseller":    "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

export interface CustomerType {
  id: string;
  companyName: string;
  companyEmail?: string;
  companyPhone?: string;
  status?: CustomerStatus;
  industry?: string;
  revenue?: string;
  website?: string;
  addressStreet?: string;
  addressCity?: string;
  addressCountry?: string;
  tags?: string[];
  contacts: ContactPerson[];
  notes: Note[];
}
