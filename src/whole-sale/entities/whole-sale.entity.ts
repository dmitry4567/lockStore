import { ApiHideProperty } from '@nestjs/swagger';
import { ProductEntity } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wholeSale')
export class WholeSaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  nameCompany: string;

  @Column()
  phone: string;

  @Column()
  nameProduct: string;

  @Column()
  count: number;

  @Column()
  logo: boolean;

  @Column()
  installWork: boolean;
}
