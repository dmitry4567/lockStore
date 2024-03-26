import { Module } from '@nestjs/common';
import { PhotoItemService } from './photo-item.service';
import { PhotoItemController } from './photo-item.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { PhotoItem } from 'src/photo-item/entities/photoItem.entity';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PhotoItem]),
    ProductsModule,
    JwtModule,
  ],
  controllers: [PhotoItemController],
  providers: [PhotoItemService],
})
export class PhotoItemModule {}
