import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Logger,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IngestRequestDto } from '../dto/ingest-request.dto.js';
import { PaginationQueryDto } from '../dto/pagination-query.dto.js';
import { PaginatedContactsResponseDto } from '../dto/paginated-contacts-response.dto.js';
import { IngestContactsService } from '../application/ingest-contacts.service.js';
import { CsvParserService } from '../application/csv-parser.service.js';
import { RawContactData } from '../application/data-validation.service.js';
import { Inject } from '@nestjs/common';
import {
  ContactRepositoryPort,
  CONTACT_REPOSITORY_PORT,
  PaginatedResult,
} from '../domain/ports/contact-repository.port.js';
import { Contact } from '../../../shared/entities/contact.entity.js';

@ApiTags('contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(
    private readonly ingestService: IngestContactsService,
    private readonly csvParser: CsvParserService,
    @Inject(CONTACT_REPOSITORY_PORT)
    private readonly contactRepository: ContactRepositoryPort,
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

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get contacts for the authenticated user',
    description:
      'Returns paginated list of contacts. If page and limit are not provided, returns all contacts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of contacts or all contacts if pagination not specified',
    type: PaginatedContactsResponseDto,
  })
  async getContacts(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Contact> | Contact[]> {
    // TODO: Extract userId from Auth0 JWT token
    // For now, using a placeholder - in production this comes from the authenticated user
    const userId = '00000000-0000-0000-0000-000000000000'; // Placeholder

    // If pagination parameters are provided, return paginated result
    if (query.page !== undefined || query.limit !== undefined) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const result = await this.contactRepository.findByUserIdPaginated(
        userId,
        page,
        limit,
      );

      this.logger.log(
        `Retrieved page ${page} of contacts for user ${userId}: ${result.data.length} items (total: ${result.total})`,
      );

      return {
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      };
    }

    // If no pagination parameters, return all contacts (backward compatibility)
    const contacts = await this.contactRepository.findByUserId(userId);
    this.logger.log(`Retrieved ${contacts.length} contacts for user ${userId}`);
    return contacts;
  }
}


