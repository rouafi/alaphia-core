import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PathRequestDto } from '../dto/path-request.dto.js';

@ApiTags('paths')
@ApiBearerAuth()
@Controller('paths')
export class PathsController {
  @Get()
  @ApiOperation({ summary: 'Compute 2–3 warm paths for a given intent' })
  @ApiQuery({ name: 'intent_id', required: true })
  async getPaths(@Query() _query: PathRequestDto): Promise<{ paths: unknown[] }> {
    // Placeholder: will call paths application service
    return { paths: [] };
  }
}


