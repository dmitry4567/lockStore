import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { UserEnitity } from 'src/user/entities/user.entity';
import { AddProductToCartDto } from './dto/addProductToCart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProductToCartDto } from './dto/updateProductToCart.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('addProductToCart')
  async addProductToCart(
    @Body() dto: AddProductToCartDto,
    @Request() req: any,
  ) {
    return await this.cartService.addProductToCart(dto, req.user);
  }

  // @Post(':userId')
  // async createCart(@Param('userId') userId: number): Promise<Cart> {
  //   const user = new UserEnitity();
  //   user.id = userId;
  //   return this.cartService.createCart(user);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('getUserCartTotalPrice')
  getUserCartTotalPrice(@Request() req: any) {
    return this.cartService.getUserCartTotalPrice(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Request() req: any) {
    return this.cartService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.cartService.findOne(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateProductFromCart')
  async updateProductFromCart(
    @Body() dto: UpdateProductToCartDto,
    @Request() req: any,
  ) {
    return await this.cartService.UpdateProductFromCart(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any): Promise<DeleteResult> {
    return this.cartService.remove(+id, req.user);
  }
}
