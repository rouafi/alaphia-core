export interface RawContactData {
  firstName: string;
  lastName: string;
  url?: string;
  email?: string;
  company?: string;
  position?: string;
  connectedOn?: string;
}

export class DataValidationService {
  /**
   * Validates required fields per FR-ING-002:
   * First Name, Last Name, URL, Email Address, Company, Position, Connected On Date
   */
  validateRequiredFields(data: RawContactData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.firstName || data.firstName.trim().length === 0) {
      errors.push('First Name is required');
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      errors.push('Last Name is required');
    }

    if (!data.url || data.url.trim().length === 0) {
      errors.push('URL is required');
    }

    // Email, Company, Position, Connected On are optional per schema but recommended
    if (data.connectedOn && !this.isValidDate(data.connectedOn)) {
      errors.push(`Invalid date format for Connected On: ${data.connectedOn}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidDate(dateString: string): boolean {
    // Try parsing LinkedIn date format: "11 Nov 2025"
    const parsed = this.parseLinkedInDate(dateString);
    return parsed !== null && !isNaN(parsed.getTime());
  }

  parseLinkedInDate(dateString: string): Date | null {
    // LinkedIn format: "11 Nov 2025" or "DD MMM YYYY"
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    const parts = dateString.trim().split(' ');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(year) || !months[monthName]) {
      return null;
    }

    return new Date(year, months[monthName], day);
  }
}

