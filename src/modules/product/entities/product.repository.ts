import dataSource from 'src/data-source';
import { Product } from './product.entity';

export const productRepository = dataSource.getRepository(Product);
