import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { User } from '../modules/user/entities/user.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'estherlama',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_discount',
  entities: [User],
  migrations: [join(__dirname, '..', 'migration', '*{.ts,.js}')],
  synchronize: false,
};
