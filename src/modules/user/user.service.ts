import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import argon2 from 'argon2';
import { USER_ROLE } from './enums/user-role.enum';
import { Shop } from '../shop/entities/shop.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
        return user;
      },
    );

    return createdUser;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
