import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IngestRequestDto } from '../dto/ingest-request.dto.js';

@ApiTags('ingestion')
@ApiBearerAuth()
@Controller('ingest')
export class IngestionController {
  @Post()
  @HttpCode(202)
  @ApiOperation({ summary: 'Ingest contacts/relationships asynchronously' })
  async ingest(@Body() _payload: IngestRequestDto): Promise<{ status: string }> {
    // For MVP scaffold, accept and acknowledge. Processing to be implemented with Redis Streams worker.
    return { status: 'accepted' };
  }
}


