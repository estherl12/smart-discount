import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required!' })
  @IsString()
  @Length(3, 255, {
    message: 'Product name must be min 3 and max 255 characters',
  })
  name: string;

  @IsNotEmpty({ message: 'Category is required!' })
  @IsUUID('4', { message: 'Category id must be a valid UUID' })
  categoryId: string;

  @IsNotEmpty({ message: 'Price is required!' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with up to 2 decimals' },
  )
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price: number;

  @IsNotEmpty({ message: 'Stock quantity is required!' })
  @Type(() => Number)
  @IsInt({ message: 'Stock quantity must be an integer' })
  @Min(0, { message: 'Stock quantity must be greater than or equal to 0' })
  stockQty: number;
}
