import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IAuthUser } from 'src/types/express';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, user: IAuthUser) {
    const category = this.categoryRepo.create({
      name: createCategoryDto.name,
      shop: { id: user.shopId },
    });

    await this.categoryRepo.save(category);
    return category;
  }

  async findAllOfAShop(user: IAuthUser, searchQuery?: string) {
    let categories;
    const shopId = user.shopId;
    if (searchQuery) {
      categories = await this.categoryRepo
        .createQueryBuilder('category')
        .innerJoin('category.shop', 'shop')
        .where('shop.id = :shopId', {
          shopId,
        })
        .andWhere('category.name ILIKE :search', {
          search: `%${searchQuery}%`,
        })
        .getMany();
    } else {
      categories = await this.categoryRepo.find({
        where: {
          shop: { id: shopId },
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return categories;
  }

  async findOne(id: string, shopId?: string) {
    return await this.categoryRepo.findOne({
      where: {
        id,
        ...(shopId ? { shop: { id: shopId } } : {}),
      },
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: IAuthUser,
  ) {
    const isCategoryExist = await this.categoryRepo.findOne({
      where: { id: id, shop: { id: user.shopId } },
    });

    if (!isCategoryExist)
      throw new BadRequestException('Category not found to update!');

    return await this.categoryRepo.update(id, { ...updateCategoryDto });
  }

  async remove(id: string, user: IAuthUser) {
    const isCategoryExist = await this.categoryRepo.findOne({
      where: { id: id, shop: { id: user.shopId } },
    });

    if (!isCategoryExist)
      throw new BadRequestException('Category not found to update!');

    return await this.categoryRepo.delete(id);
  }
}
