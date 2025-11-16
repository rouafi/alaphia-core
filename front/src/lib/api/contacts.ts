import { apiRequest } from './client'

export interface Contact {
  id: string;
  userId: string;
  sourceId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  url: string | null;
  company: string | null;
  position: string | null;
  connectedOn: string | null;
  inferredRole: unknown;
  inferredSector: string | null;
  createdAt: string;
}

export interface PaginatedContactsResponse {
  data: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const contactsApi = {
  getAll: (params?: PaginationParams): Promise<Contact[] | PaginatedContactsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiRequest(`/v1/contacts${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string): Promise<Contact> => {
    return apiRequest(`/v1/contacts/${id}`);
  },
};

