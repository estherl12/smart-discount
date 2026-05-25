import { Shop } from 'src/modules/shop/entities/shop.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Column({ unique: true })
  @Length(10, 10, { message: 'Contact number should be 10-digits' })
  contactNumber: string;

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

  @OneToOne(() => Shop, (shop) => shop.owner)
  shop: Shop;
  // @Column({ default: false })
  // isApproved: boolean;

  // @Column({ default: false })
  // isBanned: boolean;
}
