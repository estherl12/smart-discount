import { Shop } from 'src/modules/shop/entities/shop.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { USER_ROLE } from '../enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  fullName: string;

  // @Column()
  // address: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column({ type: 'character varying', nullable: true })
  password: string | null;

  @Column({ type: 'character varying', unique: true, nullable: true })
  contactNumber: string | null;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
  })
  @IsNotEmpty({ message: 'User role is required' })
  role: USER_ROLE;

  @Column({ nullable: true })
  @Length(6, 6, { message: 'Otp should be 6-digits' })
  resetOtp: string;

  @Column({ type: 'date', nullable: true })
  otpExpiresAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSuspended: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginTime: Date | null;

  @OneToOne(() => Shop, (shop) => shop.owner)
  ownedShop: Shop;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Shop, (shop) => shop.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'shopId' })
  shop: Shop;
  // @Column({ default: false })
  // isApproved: boolean;

  // @Column({ default: false })
  // isBanned: boolean;
}
