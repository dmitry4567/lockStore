import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from './config/postgres.config';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPostgresConfig,
    }),
    ProductsModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
