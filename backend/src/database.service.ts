import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private readonly sql: ReturnType<typeof neon>;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in the environment');
    }

    this.sql = neon(databaseUrl);
  }

  async getData() {
    const data = await this.sql`SELECT * FROM your_table_name`;
    return data;
  }
}
