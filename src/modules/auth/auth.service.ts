/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { verify } from 'argon2';
import { IAuthUser } from 'src/types/express';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EditProfileDto } from './dto/edit-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  async validateUser(email: string, pass: string): Promise<IAuthUser> {
    const user = await this.userService.findOneByEmail(email);

    //
    if (!user) {
      throw new BadRequestException('User is not yet registered!');
    }

    if (!user.password) {
      throw new BadRequestException('Password is not set for this user yet');
    }

    if (user.isSuspended) {
      throw new BadRequestException('User is suspended');
    }

    const isPasswordMatched = await verify(user.password, pass);
    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid email or password!');
    }

    //
    return {
      id: user.id,
      role: user.role,
      email: user.email,
      shopId: user.shop.id,
    };
  }

  async login(user: IAuthUser) {
    await this.userService.updateLastLoginTime(user.id);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      shopId: user.shopId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('Password is not set for this user yet');
    }

    const { currentPassword, newPassword } = changePasswordDto;
    const isCurrentPasswordMatched = await verify(
      user.password,
      currentPassword,
    );

    if (!isCurrentPasswordMatched) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    await this.userService.changePassword(user.id, newPassword);

    return {
      message: 'Password changed successfully',
    };
  }

  async updateProfile(userId: string, editProfileDto: EditProfileDto) {
    return this.userService.updateProfile(userId, editProfileDto);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
