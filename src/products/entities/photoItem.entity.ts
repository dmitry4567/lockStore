import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('photoItem')
export class PhotoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @ManyToOne(() => ProductEntity, (product) => product.photoItems)
  product: ProductEntity;
}
