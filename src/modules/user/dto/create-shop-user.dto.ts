import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { USER_ROLE } from '../enums/user-role.enum';

export class CreateShopUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  @IsString()
  fullName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 30, { message: 'Password must be min 8 and max 30 chars' })
  @IsString()
  password: string;

  @IsEnum(USER_ROLE, { message: 'Invalid user role' })
  role: USER_ROLE;
}
