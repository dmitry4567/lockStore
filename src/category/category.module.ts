import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
