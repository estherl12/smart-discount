import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MlService } from './ml.service';
import { PredictDiscountDto } from './dto/predict-discount.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Get('health')
  async health() {
    return this.mlService.healthCheck();
  }

  @Post('predict')
  @UseGuards(JwtAuthGuard)
  async predict(@Body() dto: PredictDiscountDto) {
    return this.mlService.predictDiscounts(dto.products);
  }

  @Post('reload')
  @UseGuards(JwtAuthGuard)
  async reload() {
    return this.mlService.reloadModels();
  }
}
