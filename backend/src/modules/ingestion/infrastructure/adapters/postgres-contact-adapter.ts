import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../../../../shared/entities/contact.entity.js';
import { ContactRepositoryPort } from '../../domain/ports/contact-repository.port.js';

@Injectable()
export class PostgresContactAdapter implements ContactRepositoryPort {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async save(contact: Contact): Promise<Contact> {
    return this.contactRepository.save(contact);
  }

  async saveMany(contacts: Contact[]): Promise<Contact[]> {
    return this.contactRepository.save(contacts);
  }

  async findByUserIdAndUrl(userId: string, url: string): Promise<Contact | null> {
    return this.contactRepository.findOne({
      where: { userId, url },
    });
  }
}

