import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity()
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderPrice: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  @JoinColumn()
  product: ProductEntity;
}
