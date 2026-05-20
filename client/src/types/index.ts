export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: { name: string; email: string };
  createdAt: string;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface LeadFilters {
  status: string;
  source: string;
  search: string;
  sort: 'latest' | 'oldest';
  page: number;
}