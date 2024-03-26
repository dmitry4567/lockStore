import { ApiProperty } from '@nestjs/swagger';

export class AddPhotosToProductDto {
  @ApiProperty()
  productId: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'file',
    },
  })
  photos: File[];
}
