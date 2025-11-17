import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service for generating embeddings using OpenAI's text-embedding-3-small model
 * Returns 768-dimensional vectors for semantic search
 */
@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly apiKey: string | undefined;
  private readonly apiUrl = 'https://api.openai.com/v1/embeddings';
  private readonly model = 'text-embedding-3-small';
  private readonly dimensions = 768;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (!this.apiKey) {
      this.logger.warn('OPENAI_API_KEY not set. Embedding generation will fail.');
    }
  }

  /**
   * Generate embedding for a text string
   * @param text The text to embed
   * @returns 768-dimensional embedding vector
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured. Cannot generate embeddings.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: text.trim(),
          dimensions: this.dimensions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json() as {
        data: Array<{ embedding: number[] }>;
      };
      
      if (!data.data || !data.data[0] || !data.data[0].embedding) {
        throw new Error('Invalid response format from OpenAI API');
      }

      const embedding = data.data[0].embedding;

      if (embedding.length !== this.dimensions) {
        throw new Error(
          `Expected embedding dimension ${this.dimensions}, got ${embedding.length}`
        );
      }

      this.logger.debug(`Generated ${this.dimensions}-dim embedding for text: ${text.substring(0, 50)}...`);
      return embedding;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error generating embedding: ${errorMsg}`, error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param texts Array of texts to embed
   * @returns Array of 768-dimensional embedding vectors
   */
  async generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured. Cannot generate embeddings.');
    }

    if (texts.length === 0) {
      return [];
    }

    // Filter out empty texts
    const validTexts = texts.map(t => t?.trim() || '').filter(t => t.length > 0);
    
    if (validTexts.length === 0) {
      throw new Error('No valid texts provided for embedding generation');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: validTexts,
          dimensions: this.dimensions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json() as {
        data: Array<{ embedding: number[] }>;
      };
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from OpenAI API');
      }

      const embeddings = data.data.map((item) => {
        const embedding = item.embedding;
        if (embedding.length !== this.dimensions) {
          throw new Error(
            `Expected embedding dimension ${this.dimensions}, got ${embedding.length}`
          );
        }
        return embedding;
      });

      this.logger.debug(`Generated ${embeddings.length} embeddings in batch`);
      return embeddings;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error generating embeddings batch: ${errorMsg}`, error);
      throw error;
    }
  }
}

