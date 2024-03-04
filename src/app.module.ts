import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from './config/postgres.config';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { FeatureModule } from './feature/feature.module';
import { MaterialModule } from './material/material.module';
import { ColorModule } from './color/color.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getPostgresConfig,
      inject: [ConfigService],
    }),
    ProductsModule,
    CategoryModule,
    UserModule,
    AuthModule,
    CartModule,
    FeatureModule,
    MaterialModule,
    ColorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
