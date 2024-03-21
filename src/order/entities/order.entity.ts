import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  ManyToOne,
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
  
  @ManyToOne(() => UserEnitity, (user) => user.orders) 
  user: UserEnitity;

  @OneToMany(() => OrderItemEntity, (orderItems) => orderItems.order)
  orderItems: OrderItemEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
