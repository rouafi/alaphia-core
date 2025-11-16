import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm.config.js';

export default new DataSource({
  ...(typeOrmConfig as any),
});


