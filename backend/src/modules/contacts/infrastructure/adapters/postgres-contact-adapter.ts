import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../../../../shared/entities/contact.entity.js';
import {
  ContactRepositoryPort,
  PaginatedResult,
} from '../../domain/ports/contact-repository.port.js';

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

  async findByUserId(userId: string): Promise<Contact[]> {
    return this.contactRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Contact>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.contactRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}

