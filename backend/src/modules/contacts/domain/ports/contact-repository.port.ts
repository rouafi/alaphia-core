import { Contact } from '../../../../shared/entities/contact.entity.js';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ContactRepositoryPort {
  save(contact: Contact): Promise<Contact>;
  saveMany(contacts: Contact[]): Promise<Contact[]>;
  findByUserIdAndUrl(userId: string, url: string): Promise<Contact | null>;
  findByUserId(userId: string): Promise<Contact[]>;
  findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Contact>>;
  updateEmbedding(contactId: string, embedding: number[]): Promise<void>;
}

// Injection token for dependency injection (using string token)
export const CONTACT_REPOSITORY_PORT = 'ContactRepositoryPort';

