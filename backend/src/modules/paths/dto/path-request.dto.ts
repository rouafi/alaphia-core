import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PathRequestDto {
  @ApiProperty({ name: 'intent_id' })
  @IsUUID()
  intent_id!: string;

  @ApiProperty({ required: false, minimum: 2, maximum: 3, default: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(3)
  max_depth?: number;
}


