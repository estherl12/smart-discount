import 'dotenv/config';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './database/typeorm.config';

export default new DataSource(typeOrmConfig);
