import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItem } from './cartItem.entitiy';
import { UserEnitity } from 'src/user/entities/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEnitity, (user) => user.cart)
  @JoinColumn()
  user: UserEnitity;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  getTotalPrice() {
    if (this.cartItems == null) {
      return 0;
    }
    
    let sum = 0;
    this.cartItems.forEach((a) => (sum += a.priceProduct));
    return sum;
  }
}
