#!/usr/bin/env tsx
/**
 * Helper script to upload CSV file to the ingest endpoint
 * Usage: tsx scripts/upload-csv.ts <path-to-csv-file>
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const csvPath = process.argv[2] || join(__dirname, '../../docs/data_sources/Connections.csv');

try {
  const csvContent = readFileSync(csvPath, 'utf-8');

  const payload = {
    sourceType: 'CSV_UPLOAD',
    csvContent,
  };

  const response = await fetch('http://localhost:4000/v1/ingest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log('Response:', JSON.stringify(result, null, 2));
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}

