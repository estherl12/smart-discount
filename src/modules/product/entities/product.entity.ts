import { Category } from 'src/modules/category/entities/category.entity';
import { Sale } from 'src/modules/sales/entities/sale.entity';
import { Shop } from 'src/modules/shop/entities/shop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'int',
    default: 0,
  })
  stockQty: number;

  @OneToMany(() => Sale, (sale) => sale.product)
  sales: Sale[];

  @ManyToOne(() => Shop, (shop) => shop.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shopId' })
  shop: Shop;
}
