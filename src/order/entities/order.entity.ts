import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { UserEnitity } from 'src/user/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  shippingAddress: string;

  @Column()
  totalPrice: number;

  @OneToMany(() => UserEnitity, (user) => user.order)
  @JoinColumn()
  user: UserEnitity;

  @OneToMany(() => OrderItemEntity, (orderItems) => orderItems.order)
  orderItems: OrderItemEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
