import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import argon2 from 'argon2';
import { USER_ROLE } from './enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const isEmailUsed = await this.userRepository.findOne({
      where: { email },
    });

    if (isEmailUsed) {
      throw new ConflictException('Email is already used');
    }
    const hashedPassword = await argon2.hash(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName: createUserDto.fullName,
      contactNumber: createUserDto.contactNumber,
      role: USER_ROLE.ADMIN,
    });

    await this.userRepository.save(user);
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
