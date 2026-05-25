import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { IAuthUser } from 'src/types/express';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepo: Repository<Sale>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createSaleDto: CreateSaleDto, user: IAuthUser) {
    const product = await this.productRepo.findOne({
      where: { id: createSaleDto.productId, shop: { id: user.shopId } },
    });

    if (!product)
      throw new BadRequestException('Product not found to create sale!');

    const sale = this.saleRepo.create({
      ...createSaleDto,
      date: createSaleDto.date ? new Date(createSaleDto.date) : undefined,
      product,
      shop: { id: user.shopId },
    });

    return await this.saleRepo.save(sale);
  }

  async findAllOfAShop(user: IAuthUser, searchQuery?: string) {
    const queryBuilder = this.saleRepo
      .createQueryBuilder('sale')
      .innerJoinAndSelect('sale.product', 'product')
      .innerJoin('sale.shop', 'shop')
      .where('shop.id = :shopId', { shopId: user.shopId });

    if (searchQuery) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${searchQuery}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number, user: IAuthUser) {
    return await this.saleRepo.findOne({
      where: { id, shop: { id: user.shopId } },
      relations: { product: true },
    });
  }

  async update(id: number, updateSaleDto: UpdateSaleDto, user: IAuthUser) {
    const sale = await this.saleRepo.findOne({
      where: { id, shop: { id: user.shopId } },
      relations: { product: true },
    });

    if (!sale) throw new BadRequestException('Sale not found to update!');

    if (updateSaleDto.productId) {
      const product = await this.productRepo.findOne({
        where: { id: updateSaleDto.productId, shop: { id: user.shopId } },
      });

      if (!product)
        throw new BadRequestException('Product not found to update sale!');

      sale.product = product;
      sale.productId = updateSaleDto.productId;
    }

    Object.assign(sale, {
      ...updateSaleDto,
      date: updateSaleDto.date ? new Date(updateSaleDto.date) : sale.date,
    });

    return await this.saleRepo.save(sale);
  }

  async remove(id: number, user: IAuthUser) {
    const sale = await this.saleRepo.findOne({
      where: { id, shop: { id: user.shopId } },
    });

    if (!sale) throw new BadRequestException('Sale not found to delete!');

    return await this.saleRepo.delete(id);
  }
}
