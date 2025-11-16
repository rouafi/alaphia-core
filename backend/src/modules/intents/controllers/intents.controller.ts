import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateIntentDto } from '../dto/create-intent.dto.js';

@ApiTags('intents')
@ApiBearerAuth()
@Controller('intents')
export class IntentsController {
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a user intent' })
  async create(@Body() payload: CreateIntentDto): Promise<{ id: string; status: string }> {
    // Placeholder: would persist via repository and return entity ID
    return { id: '00000000-0000-0000-0000-000000000000', status: 'created' };
  }
}


