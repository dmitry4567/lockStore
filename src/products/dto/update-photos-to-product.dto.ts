import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhotosToProductDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'file',
    },
  })
  photos: File[];
}
