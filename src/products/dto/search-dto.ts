import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ColorEntity } from 'src/color/entities/color.entity';
import { MaterialEntity } from 'src/material/entities/material.entity';

export class ProductSearchDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryid? = '1,2';

  @ApiProperty()
  @IsOptional()
  @IsString()
  featureid? = '1,2';

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  colorid?: ColorEntity;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  materialid?: MaterialEntity;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  material?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  size?: string;
}
