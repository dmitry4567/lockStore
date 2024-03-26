import { CartItem } from 'src/cart/entities/cartItem.entitiy';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ColorEntity } from 'src/color/entities/color.entity';
import { FeatureEntity } from 'src/feature/entities/feature.entity';
import { MaterialEntity } from 'src/material/entities/material.entity';
import { OrderItemEntity } from 'src/order/entities/order-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PhotoItem } from '../../photo-item/entities/photoItem.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  rate: number;

  @Column()
  price: number;

  @Column()
  oldPrice: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
  })
  @JoinColumn()
  category: CategoryEntity;

  @ManyToOne(() => FeatureEntity, (feature) => feature.products, {
    eager: true,
  })
  @JoinColumn()
  feature: FeatureEntity;

  @ManyToOne(() => MaterialEntity, (material) => material.products, {
    eager: true,
  })
  @JoinColumn()
  material: MaterialEntity;

  @ManyToOne(() => ColorEntity, (color) => color.products, {
    eager: true,
  })
  @JoinColumn()
  color: ColorEntity;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItem: CartItem[];

  @OneToMany(() => OrderItemEntity, (orderItems) => orderItems.product)
  orderItems: OrderItemEntity[];

  @OneToMany(() => PhotoItem, (photoItem) => photoItem.product)
  photoItems: PhotoItem[];
}
