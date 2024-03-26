import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductEntity } from './entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { JwtModule } from '@nestjs/jwt';
import { PhotoItem } from '../photo-item/entities/photoItem.entity';
import { FeatureModule } from 'src/feature/feature.module';
import { MaterialModule } from 'src/material/material.module';
import { ColorModule } from 'src/color/color.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ProductEntity, PhotoItem, CategoryEntity]),
    CategoryModule,
    FeatureModule,
    MaterialModule,
    ColorModule,
    JwtModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
