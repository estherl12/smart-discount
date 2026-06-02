import { Category } from 'src/modules/category/entities/category.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Sale } from 'src/modules/sales/entities/sale.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('shops')
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @OneToOne(() => User, (user) => user.ownedShop, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => User, (user) => user.shop)
  users: User[];

  @OneToMany(() => Category, (category) => category.shop)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];

  @OneToMany(() => Sale, (sale) => sale.shop)
  sales: Sale[];
}
