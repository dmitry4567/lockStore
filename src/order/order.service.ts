import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserService } from 'src/user/user.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItemEntity)
    private orderitemRepository: Repository<OrderItemEntity>,
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) { }

  async order(req: any, dto: CreateOrderDto) {
    const userBasket = await this.cartService.getUserBasket(req.user);

    if (userBasket.cartItems.length == 0) {
      throw new BadRequestException(
        'You cannot create an order with an empty cart',
      );
    }

    const order = this.orderRepository.create({
      status: dto.status,
      shippingAddress: dto.shippingAddress,
      totalPrice: 0,
      user: req.user,
      orderItems: [],
    });

    await this.orderRepository.save(order);

    for (let i = 0; i <= userBasket.cartItems.length; i++) {
      if (userBasket.cartItems[i] && userBasket.cartItems[i].product) {
        const orderItem = this.orderitemRepository.create({
          product: userBasket.cartItems[i].product,
        });
        orderItem.orderPrice = userBasket.cartItems[i].priceProduct;
        await this.orderitemRepository.save(orderItem);
        order.orderItems.push(orderItem);
      }
    }

    if (order.orderItems == null) {
      return 0;
    }
    let sum = 0;
    order.orderItems.forEach((a) => (sum += a.orderPrice));
    order.totalPrice = sum;

    order.user = req.user;
    const orderNew = await this.orderRepository.save(order);

    await this.cartService.removeCartItems(req.user);

    return orderNew;
  }

  async getOrdersUser(req: any) {
    const userOrder = await this.orderRepository.find({
      relations: {
        orderItems: {
          product: true,
        },
      },
      where: {
        user: req.user,
      },
    });
    return userOrder;
  }
}
