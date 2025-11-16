import { Contact } from '../../../../shared/entities/contact.entity.js';

export interface ContactRepositoryPort {
  save(contact: Contact): Promise<Contact>;
  saveMany(contacts: Contact[]): Promise<Contact[]>;
  findByUserIdAndUrl(userId: string, url: string): Promise<Contact | null>;
}

// Injection token for dependency injection (using string token)
export const CONTACT_REPOSITORY_PORT = 'ContactRepositoryPort';

