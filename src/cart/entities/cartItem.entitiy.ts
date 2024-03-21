import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Quantity: number;

  @Column()
  priceProduct: number;

  @ManyToOne(() => ProductEntity, (product) => product.cartItem)
  @JoinColumn()
  product: ProductEntity;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;
}