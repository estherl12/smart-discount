import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import argon2 from 'argon2';
import { USER_ROLE } from './enums/user-role.enum';
import { Shop } from '../shop/entities/shop.entity';
import { EditProfileDto } from '../auth/dto/edit-profile.dto';
import { IAuthUser } from 'src/types/express';
import { CreateShopUserDto } from './dto/create-shop-user.dto';
import { UpdateUserStatusDto, USER_STATUS } from './dto/update-user-status.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, shopName } = createUserDto;
    const isEmailUsed = await this.userRepository.findOne({
      where: { email },
    });

    if (isEmailUsed) {
      throw new ConflictException('Email is already used');
    }
    const hashedPassword = await argon2.hash(password);

    const createdUser = await this.userRepository.manager.transaction(
      async (manager) => {
        const user = manager.create(User, {
          email,
          password: hashedPassword,
          fullName: createUserDto.fullName,
          contactNumber: createUserDto.contactNumber,
          role: USER_ROLE.ADMIN,
        });

        await manager.save(user);

        const shop = manager.create(Shop, {
          name: shopName,
          owner: user,
        });

        await manager.save(shop);

        user.shop = shop;
        await manager.save(user);

        const savedUser = await manager.findOne(User, {
          where: { id: user.id },
          relations: { shop: true },
        });

        if (!savedUser) {
          throw new NotFoundException('User not found after creation');
        }

        return savedUser;
      },
    );

    return createdUser;
  }

  async createShopUser(user: IAuthUser, createShopUserDto: CreateShopUserDto) {
    if (user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('Only admins can create shop users');
    }

    const isEmailUsed = await this.userRepository.findOne({
      where: { email: createShopUserDto.email },
    });
    if (isEmailUsed) {
      throw new ConflictException('Email is already used');
    }

    const shop = await this.shopRepository.findOne({
      where: { id: user.shopId },
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const hashedPassword = await argon2.hash(createShopUserDto.password);

    const createdUser = this.userRepository.create({
      fullName: createShopUserDto.fullName,
      email: createShopUserDto.email,
      role: createShopUserDto.role,
      password: hashedPassword,
      contactNumber: null,
      shop,
    });

    return this.userRepository.save(createdUser);
  }

  async findShopUsers(authUser: IAuthUser) {
    if (authUser.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('Only admins can view shop users');
    }

    const users = await this.userRepository.find({
      where: { shop: { id: authUser.shopId } },
      order: { createdAt: 'DESC' },
    });

    return {
      users: users.map((user) => ({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: this.getUserStatus(user),
        lastloggedIn: user.lastLoginTime,
      })),
      summary: {
        totalUsers: users.length,
        totalActiveUsers: users.filter((user) => user.isActive).length,
        totalAdminUsers: users.filter((user) => user.role === USER_ROLE.ADMIN)
          .length,
      },
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string) {
    const userInfo = await this.userRepository.findOne({
      where: { email },
      relations: { shop: true },
    });

    return userInfo;
  }

  async findOneById(id: string) {
    const userInfo = await this.userRepository.findOne({
      where: { id },
      relations: { shop: true },
    });

    return userInfo;
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await argon2.hash(newPassword);

    await this.userRepository.update(
      { id },
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    );
  }

  async updateLastLoginTime(id: string): Promise<void> {
    await this.userRepository.update(
      { id },
      {
        isActive: true,
        lastLoginTime: new Date(),
        updatedAt: new Date(),
      },
    );
  }

  async updateStatus(
    authUser: IAuthUser,
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
  ) {
    if (authUser.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('Only admins can update user status');
    }

    const user = await this.userRepository.findOne({
      where: { id, shop: { id: authUser.shopId } },
      relations: { shop: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    switch (updateUserStatusDto.status) {
      case USER_STATUS.ACTIVE:
        user.isActive = true;
        user.isSuspended = false;
        break;
      case USER_STATUS.INACTIVE:
        user.isActive = false;
        user.isSuspended = false;
        break;
      case USER_STATUS.SUSPENDED:
        user.isActive = false;
        user.isSuspended = true;
        break;
    }
    user.updatedAt = new Date();

    return this.userRepository.save(user);
  }

  async updateProfile(id: string, editProfileDto: EditProfileDto) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const emailOwner = await this.userRepository.findOne({
      where: { email: editProfileDto.email },
    });
    if (emailOwner && emailOwner.id !== id) {
      throw new ConflictException('Email is already used');
    }

    const contactNumberOwner = await this.userRepository.findOne({
      where: { contactNumber: editProfileDto.contactNumber },
    });
    if (contactNumberOwner && contactNumberOwner.id !== id) {
      throw new ConflictException('Contact number is already used');
    }

    const updatedUser = await this.userRepository.manager.transaction(
      async (manager) => {
        user.fullName = editProfileDto.fullName;
        user.email = editProfileDto.email;
        user.contactNumber = editProfileDto.contactNumber;
        user.updatedAt = new Date();

        await manager.save(user);

        if (!user.shop) {
          throw new NotFoundException('Shop not found');
        }

        user.shop.name = editProfileDto.shopName;
        await manager.save(user.shop);

        return manager.findOne(User, {
          where: { id },
          relations: { shop: true },
        });
      },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private getUserStatus(user: User): USER_STATUS {
    if (user.isSuspended) {
      return USER_STATUS.SUSPENDED;
    }

    return user.isActive ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;
  }
}
