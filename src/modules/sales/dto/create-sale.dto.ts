import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty({ message: 'Amount is required!' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number with up to 2 decimals' },
  )
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  amount: number;

  @IsNotEmpty({ message: 'Quantity is required!' })
  @Type(() => Number)
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be greater than 0' })
  qty: number;

  @IsNotEmpty({ message: 'Product is required!' })
  @IsUUID('4', { message: 'Product id must be a valid UUID' })
  productId: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date must be a valid ISO date string' })
  date?: string;
}
