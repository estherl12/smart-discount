import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { IAuthUser } from 'src/types/express';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto, user: IAuthUser) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
      user.shopId,
    );

    if (!category)
      throw new BadRequestException('Category not found to create product!');

    const product = this.productRepo.create({
      ...createProductDto,
      category,
      shop: { id: user.shopId },
    });

    return await this.productRepo.save(product);
  }

  async findAllOfAShop(user: IAuthUser, searchQuery?: string) {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.shop', 'shop')
      .leftJoinAndSelect('product.category', 'category')
      .where('shop.id = :shopId', { shopId: user.shopId });

    if (searchQuery) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${searchQuery}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: IAuthUser) {
    return await this.productRepo.findOne({
      where: { id, shop: { id: user.shopId } },
      relations: { category: true },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: IAuthUser,
  ) {
    const product = await this.productRepo.findOne({
      where: { id, shop: { id: user.shopId } },
      relations: { category: true },
    });

    if (!product) throw new BadRequestException('Product not found to update!');

    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
        user.shopId,
      );

      if (!category)
        throw new BadRequestException('Category not found to update product!');

      product.category = category;
      product.categoryId = updateProductDto.categoryId;
    }

    Object.assign(product, updateProductDto);

    return await this.productRepo.save(product);
  }

  async remove(id: string, user: IAuthUser) {
    const product = await this.productRepo.findOne({
      where: { id, shop: { id: user.shopId } },
    });

    if (!product) throw new BadRequestException('Product not found to delete!');

    return await this.productRepo.delete(id);
  }
}
