import { Type } from 'class-transformer';
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';

class ProductFeature {
  @IsString()
  product_id: string;

  @IsObject()
  features: Record<string, number>;
}

export class PredictDiscountDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductFeature)
  products: ProductFeature[];
}

export class ProductPrediction {
  product_id: string;
  recommended_discount: number;
  confidence: number;
  predicted_sales_lift: number;
  revenue_impact: number;
  slow_risk_probability: number;
}
