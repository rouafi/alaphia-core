import { Inject, Injectable, Logger } from '@nestjs/common';
import { Contact } from '../../../shared/entities/contact.entity.js';
import { ContactRepositoryPort, CONTACT_REPOSITORY_PORT } from '../domain/ports/contact-repository.port.js';
import { DataValidationService, RawContactData } from './data-validation.service.js';
import { DataModelingService } from '../domain/services/data-modeling.service.js';

@Injectable()
export class IngestContactsService {
  private readonly logger = new Logger(IngestContactsService.name);

  constructor(
    @Inject(CONTACT_REPOSITORY_PORT)
    private readonly contactRepository: ContactRepositoryPort,
    private readonly validationService: DataValidationService,
    private readonly modelingService: DataModelingService,
  ) {}

  /**
   * Processes and saves contact records
   * Returns count of successfully ingested contacts
   */
  async ingestContacts(
    rawContacts: RawContactData[],
    userId: string,
  ): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
    const errors: string[] = [];
    const validContacts: Contact[] = [];

    for (const rawContact of rawContacts) {
      const validation = this.validationService.validateRequiredFields(rawContact);
      if (!validation.valid) {
        errors.push(
          `Invalid contact ${rawContact.firstName} ${rawContact.lastName}: ${validation.errors.join(', ')}`,
        );
        continue;
      }

      try {
        const contact = this.modelingService.mapToContact(rawContact, userId);

        // Check if contact already exists (by URL)
        if (contact.url) {
          const existing = await this.contactRepository.findByUserIdAndUrl(userId, contact.url);
          if (existing) {
            this.logger.debug(`Contact already exists: ${contact.url}`);
            continue; // Skip duplicates
          }
        }

        validContacts.push(contact);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Error mapping contact ${rawContact.firstName} ${rawContact.lastName}: ${errorMsg}`);
        this.logger.error(`Error mapping contact`, error);
      }
    }

    // Batch save valid contacts
    let successCount = 0;
    if (validContacts.length > 0) {
      try {
        await this.contactRepository.saveMany(validContacts);
        successCount = validContacts.length;
        this.logger.log(`Successfully ingested ${successCount} contacts for user ${userId}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Error saving contacts: ${errorMsg}`);
        this.logger.error(`Error saving contacts`, error);
      }
    }

    return {
      successCount,
      errorCount: errors.length,
      errors,
    };
  }
}

