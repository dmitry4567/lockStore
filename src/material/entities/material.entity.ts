import { ApiHideProperty } from '@nestjs/swagger';
import { ProductEntity } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('material')
export class MaterialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ApiHideProperty()
  @OneToMany(() => ProductEntity, (product) => product.material)
  products: MaterialEntity[];
}
