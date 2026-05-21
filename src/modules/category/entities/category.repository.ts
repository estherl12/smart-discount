import dataSource from 'src/data-source';
import { Category } from './category.entity';

export const categoryRepository = dataSource.getRepository(Category);
