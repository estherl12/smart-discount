import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class EditProfileDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  @IsString()
  fullName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Contact number is required' })
  @Length(10, 10, { message: 'Contact number should be 10-digits' })
  @IsString()
  contactNumber: string;

  @IsNotEmpty({ message: 'Shop name is required' })
  @IsString()
  shopName: string;
}
