import { ApiProperty } from '@nestjs/swagger';
import { Contact } from '../../../shared/entities/contact.entity.js';

export class PaginatedContactsResponseDto {
  @ApiProperty({
    description: 'Array of contacts',
    type: [Contact],
  })
  data!: Contact[];

  @ApiProperty({
    description: 'Total number of contacts',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number (1-based)',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages!: number;

  @ApiProperty({
    description: 'Whether there are more pages after the current page',
    example: true,
  })
  hasNextPage!: boolean;

  @ApiProperty({
    description: 'Whether there are pages before the current page',
    example: false,
  })
  hasPreviousPage!: boolean;
}

