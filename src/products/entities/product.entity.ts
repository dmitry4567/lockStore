import { CartItem } from 'src/cart/entities/cartItem.entitiy';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ColorEntity } from 'src/color/entities/color.entity';
import { FeatureEntity } from 'src/feature/entities/feature.entity';
import { MaterialEntity } from 'src/material/entities/material.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  title: string;

  @Column()
  rate: number;

  @Column()
  price: number;

  @Column()
  oldPrice: number;

  @OneToOne(() => CartItem, (cartItem) => cartItem.product)
  cartItem: CartItem;

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
}
