import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  @Length(8, 30, {
    message: 'Current password must be min 8 and max 30 chars',
  })
  @IsString()
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @Length(8, 30, { message: 'New password must be min 8 and max 30 chars' })
  @IsString()
  newPassword: string;
}
