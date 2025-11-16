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

    return contact;
  }
}

