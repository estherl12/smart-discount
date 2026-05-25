import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { Request } from 'express';
import type { IAuthUser } from 'src/types/express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/new')
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productService.create(createProductDto, req.user as IAuthUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('searchQuery') searchQuery: string, @Req() req: Request) {
    return this.productService.findAllOfAShop(
      req.user as IAuthUser,
      searchQuery,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.productService.findOne(id, req.user as IAuthUser);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    return this.productService.update(
      id,
      updateProductDto,
      req.user as IAuthUser,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.productService.remove(id, req.user as IAuthUser);
  }
}
