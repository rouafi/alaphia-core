import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ContactRecordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Embedding vector (768-dim) for semantic search. If not provided, can be generated later.',
    type: [Number],
    example: [0.1, 0.2, 0.3, /* ... 768 numbers total ... */]
  })
  @IsOptional()
  @IsArray()
  embedding?: number[];
}

export class IngestRequestDto {
  @ApiProperty({ enum: ['LINKEDIN_EXPORT', 'GMAIL_SYNC', 'CSV_UPLOAD'] })
  @IsIn(['LINKEDIN_EXPORT', 'GMAIL_SYNC', 'CSV_UPLOAD'])
  sourceType!: 'LINKEDIN_EXPORT' | 'GMAIL_SYNC' | 'CSV_UPLOAD';

  @ApiProperty({ type: [ContactRecordDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactRecordDto)
  records?: ContactRecordDto[];

  @ApiProperty({ required: false, description: 'CSV content for CSV_UPLOAD source type (can be base64-encoded or plain text with \\n for newlines)' })
  @IsOptional()
  @IsString()
  csvContent?: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'CSV file to upload' })
  file!: Express.Multer.File;
}


