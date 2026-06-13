import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { ProductPrediction } from './dto/predict-discount.dto';

@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);
  private readonly mlBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.mlBaseUrl =
      this.configService.get<string>('ML_SERVICE_URL') ||
      'http://localhost:5000';
  }

  async predictDiscounts(
    products: { product_id: string; features: Record<string, number> }[],
  ): Promise<ProductPrediction[]> {
    const { data } = await firstValueFrom(
      this.httpService.post<{ predictions: ProductPrediction[] }>(
        `${this.mlBaseUrl}/api/predict`,
        { products },
      ),
    );
    return data.predictions;
  }

  async healthCheck(): Promise<{ status: string }> {
    const { data } = await firstValueFrom(
      this.httpService.get<{ status: string }>(`${this.mlBaseUrl}/api/health`),
    );
    return data;
  }

  async reloadModels(): Promise<{ status: string }> {
    const { data } = await firstValueFrom(
      this.httpService.post<{ status: string }>(`${this.mlBaseUrl}/api/reload`),
    );
    return data;
  }
}
