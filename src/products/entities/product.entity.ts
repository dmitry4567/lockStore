import { CategoryEntities } from 'src/category/entities/category.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => CategoryEntities, (category) => category.name, { eager: true })
  @JoinColumn()
  category: CategoryEntities;
}
