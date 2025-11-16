import { Injectable, Logger } from '@nestjs/common';
import { RawContactData } from './data-validation.service.js';

@Injectable()
export class CsvParserService {
  private readonly logger = new Logger(CsvParserService.name);

  /**
   * Parses LinkedIn Connections CSV format
   * Handles the note header and extracts contact records
   */
  parseLinkedInConnectionsCsv(csvContent: string): RawContactData[] {
    const lines = csvContent.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

    // Find the header row (contains "First Name,Last Name,URL...")
    let headerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('First Name') && lines[i].includes('Last Name') && lines[i].includes('URL')) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      throw new Error('Could not find CSV header row');
    }

    const headerLine = lines[headerIndex];
    const headers = this.parseCsvLine(headerLine);

    // Find column indices
    const firstNameIdx = headers.indexOf('First Name');
    const lastNameIdx = headers.indexOf('Last Name');
    const urlIdx = headers.indexOf('URL');
    const emailIdx = headers.indexOf('Email Address');
    const companyIdx = headers.indexOf('Company');
    const positionIdx = headers.indexOf('Position');
    const connectedOnIdx = headers.indexOf('Connected On');

    if (firstNameIdx === -1 || lastNameIdx === -1 || urlIdx === -1) {
      throw new Error('Required CSV columns not found');
    }

    // Parse data rows (everything after header)
    const contacts: RawContactData[] = [];

    for (let i = headerIndex + 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);

      // Skip empty rows
      if (values.every((v) => !v || v.trim().length === 0)) {
        continue;
      }

      const contact: RawContactData = {
        firstName: values[firstNameIdx] || '',
        lastName: values[lastNameIdx] || '',
        url: urlIdx >= 0 ? values[urlIdx] : undefined,
        email: emailIdx >= 0 ? values[emailIdx] : undefined,
        company: companyIdx >= 0 ? values[companyIdx] : undefined,
        position: positionIdx >= 0 ? values[positionIdx] : undefined,
        connectedOn: connectedOnIdx >= 0 ? values[connectedOnIdx] : undefined,
      };

      contacts.push(contact);
    }

    this.logger.log(`Parsed ${contacts.length} contacts from CSV`);
    return contacts;
  }

  /**
   * Simple CSV line parser that handles quoted fields
   */
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = i + 1 < line.length ? line[i + 1] : null;

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());

    return result;
  }
}

