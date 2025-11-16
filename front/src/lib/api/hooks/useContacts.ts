import { useQuery } from '@tanstack/react-query';
import { contactsApi, PaginationParams } from '../contacts';

export function useContacts(params?: PaginationParams) {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => contactsApi.getAll(params),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => contactsApi.getById(id),
    enabled: !!id,
  });
}

