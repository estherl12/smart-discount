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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { Request } from 'express';
import type { IAuthUser } from 'src/types/express';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/new')
  @UseGuards(JwtAuthGuard)
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    return this.categoryService.create(
      createCategoryDto,
      req.user as IAuthUser,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Param('searchQuery') searchQuery: string, @Req() req: Request) {
    return this.categoryService.findAllOfAShop(
      req.user as IAuthUser,
      searchQuery,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request,
  ) {
    return this.categoryService.update(
      id,
      updateCategoryDto,
      req.user as IAuthUser,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.categoryService.remove(id, req.user as IAuthUser);
  }
}
