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
}

export class IngestRequestDto {
  @ApiProperty({ enum: ['LINKEDIN_EXPORT', 'GMAIL_SYNC', 'CSV_UPLOAD'] })
  @IsIn(['LINKEDIN_EXPORT', 'GMAIL_SYNC', 'CSV_UPLOAD'])
  sourceType!: 'LINKEDIN_EXPORT' | 'GMAIL_SYNC' | 'CSV_UPLOAD';

  @ApiProperty({ type: [ContactRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactRecordDto)
  records!: ContactRecordDto[];
}


