import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name is required!' })
  @IsString()
  @Length(3, 30, { message: 'Category name must be min 3 and max 255' })
  name: string;
}
