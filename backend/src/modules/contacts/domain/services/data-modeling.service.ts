import { Injectable } from '@nestjs/common';
import { Contact } from '../../../../shared/entities/contact.entity.js';
import { RawContactData } from '../../application/data-validation.service.js';
import { DataValidationService } from '../../application/data-validation.service.js';

@Injectable()
export class DataModelingService {
  constructor(private readonly validationService: DataValidationService) {}

  /**
   * Maps raw CSV/JSON data to Contact entity
   */
  mapToContact(rawData: RawContactData, userId: string): Contact {
    const contact = new Contact();
    contact.userId = userId;
    contact.firstName = rawData.firstName?.trim() || null;
    contact.lastName = rawData.lastName?.trim() || null;
    contact.email = rawData.email?.trim() || null;
    contact.url = rawData.url?.trim() || null;
    contact.company = rawData.company?.trim() || null;
    contact.position = rawData.position?.trim() || null;

    // Parse LinkedIn date format: "11 Nov 2025" -> Date
    if (rawData.connectedOn) {
      const parsedDate = this.validationService.parseLinkedInDate(rawData.connectedOn);
      contact.connectedOn = parsedDate ? parsedDate.toISOString().split('T')[0] : null;
    } else {
      contact.connectedOn = null;
    }

    // Extract source ID from LinkedIn URL if available
    if (contact.url && contact.url.includes('linkedin.com/in/')) {
      const match = contact.url.match(/linkedin\.com\/in\/([^/?]+)/);
      if (match) {
        contact.sourceId = match[1];
      }
    }

    // Note: profile_text is a generated column, so it's automatically computed by the database
    // from position and company. We don't need to set it here.

    // Note: embedding is handled separately via raw SQL since TypeORM doesn't support vector types
    // If embedding is provided in rawData, it should be set after contact creation using raw SQL
    // For now, we'll save the contact first, then embeddings can be updated later

    return contact;
  }
}

