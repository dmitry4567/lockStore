import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  oldPrice: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  colorId: number;

  @ApiProperty()
  featureId: number;

  @ApiProperty()
  materialId: number;
}
