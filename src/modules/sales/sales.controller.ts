import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { Request } from 'express';
import type { IAuthUser } from 'src/types/express';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('/new')
  @UseGuards(JwtAuthGuard)
  create(@Body() createSaleDto: CreateSaleDto, @Req() req: Request) {
    return this.salesService.create(createSaleDto, req.user as IAuthUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('searchQuery') searchQuery: string, @Req() req: Request) {
    return this.salesService.findAllOfAShop(
      req.user as IAuthUser,
      searchQuery,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.salesService.findOne(+id, req.user as IAuthUser);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @Req() req: Request,
  ) {
    return this.salesService.update(+id, updateSaleDto, req.user as IAuthUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.salesService.remove(+id, req.user as IAuthUser);
  }
}
