import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  image: Express.Multer.File;

  @IsString()
  title: string = 'Название акции';

  @IsNumber()
  rate: number = 4;

  @IsNumber()
  price: number = 30000;

  @IsNumber()
  oldPrice: number = 37000;
}
