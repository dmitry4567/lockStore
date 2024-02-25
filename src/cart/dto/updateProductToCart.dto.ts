import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AddProductToCartDto } from './addProductToCart.dto';

export class UpdateProductToCartDto extends PartialType(AddProductToCartDto) {}