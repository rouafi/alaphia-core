import { Body, Controller, HttpCode, Post, Logger, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngestRequestDto } from '../dto/ingest-request.dto.js';
import { IngestContactsService } from '../application/ingest-contacts.service.js';
import { CsvParserService } from '../application/csv-parser.service.js';
import { RawContactData } from '../application/data-validation.service.js';

@ApiTags('ingestion')
@ApiBearerAuth()
@Controller('ingest')
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);

  constructor(
    private readonly ingestService: IngestContactsService,
    private readonly csvParser: CsvParserService,
  ) {}

  @Post()
  @HttpCode(202)
  @ApiOperation({ summary: 'Ingest contacts/relationships (JSON payload)' })
  @ApiResponse({ status: 202, description: 'Accepted for processing' })
  async ingest(@Body() payload: IngestRequestDto): Promise<{
    status: string;
    successCount: number;
    errorCount: number;
    errors?: string[];
  }> {
    // TODO: Extract userId from Auth0 JWT token
    // For now, using a placeholder - in production this comes from the authenticated user
    const userId = '00000000-0000-0000-0000-000000000000'; // Placeholder

    let rawContacts: RawContactData[] = [];
    let csvContent: string | null = null;

    if (payload.sourceType === 'CSV_UPLOAD' && payload.csvContent) {
      // Handle base64-encoded CSV or plain CSV string
      csvContent = payload.csvContent;
      
      // Try to decode base64 if it looks like base64
      if (csvContent && !csvContent.includes('\n') && csvContent.length > 100) {
        try {
          csvContent = Buffer.from(csvContent, 'base64').toString('utf-8');
          this.logger.debug('Decoded base64 CSV content');
        } catch {
          // Not base64, use as-is
        }
      }
    } else if (payload.records && payload.records.length > 0) {
      // Use provided records array
      rawContacts = payload.records.map((r) => ({
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        url: r.url,
        company: r.company,
        position: r.position,
        connectedOn: undefined, // Not in DTO, would need to be added
      }));
    } else {
      return {
        status: 'error',
        successCount: 0,
        errorCount: 1,
        errors: ['Either csvContent (base64 or plain) or records array must be provided'],
      };
    }

    // Parse CSV if we have CSV content
    if (csvContent) {
      try {
        rawContacts = this.csvParser.parseLinkedInConnectionsCsv(csvContent);
        this.logger.log(`Parsed ${rawContacts.length} contacts from CSV`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Error parsing CSV: ${errorMsg}`, error);
        return {
          status: 'error',
          successCount: 0,
          errorCount: 1,
          errors: [`CSV parsing failed: ${errorMsg}`],
        };
      }
    }

    // Process contacts
    const result = await this.ingestService.ingestContacts(rawContacts, userId);

    return {
      status: result.errorCount > 0 ? 'partial' : 'accepted',
      successCount: result.successCount,
      errorCount: result.errorCount,
      errors: result.errors.length > 0 ? result.errors : undefined,
    };
  }

  @Post('upload')
  @HttpCode(202)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Ingest contacts from CSV file upload' })
  @ApiResponse({ status: 202, description: 'Accepted for processing' })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{
    status: string;
    successCount: number;
    errorCount: number;
    errors?: string[];
  }> {
    // TODO: Extract userId from Auth0 JWT token
    const userId = '00000000-0000-0000-0000-000000000000'; // Placeholder

    if (!file) {
      return {
        status: 'error',
        successCount: 0,
        errorCount: 1,
        errors: ['No file uploaded'],
      };
    }

    const csvContent = file.buffer.toString('utf-8');
    let rawContacts: RawContactData[] = [];

    try {
      rawContacts = this.csvParser.parseLinkedInConnectionsCsv(csvContent);
      this.logger.log(`Parsed ${rawContacts.length} contacts from uploaded CSV file`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error parsing CSV: ${errorMsg}`, error);
      return {
        status: 'error',
        successCount: 0,
        errorCount: 1,
        errors: [`CSV parsing failed: ${errorMsg}`],
      };
    }

    // Process contacts
    const result = await this.ingestService.ingestContacts(rawContacts, userId);

    return {
      status: result.errorCount > 0 ? 'partial' : 'accepted',
      successCount: result.successCount,
      errorCount: result.errorCount,
      errors: result.errors.length > 0 ? result.errors : undefined,
    };
  }
}


