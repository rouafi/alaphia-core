import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIntentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  intentName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requestText!: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  targetKeywords?: string[];

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


