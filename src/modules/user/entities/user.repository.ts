import dataSource from 'src/data-source';
import { User } from './user.entity';

export const userRepository = dataSource.getRepository(User);
