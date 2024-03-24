import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('ORDER')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('post')
  async makeOrder(@Body() dto: CreateOrderDto, @Request() req: any) {
    return await this.orderService.order(req, dto);
  }

  @Get('getOrders')
  async getItemsFromOrder(@Request() req: any) {
    return await this.orderService.getOrdersUser(req);
  }
}
