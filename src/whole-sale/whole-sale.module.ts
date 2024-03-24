import { Module } from '@nestjs/common';
import { WholeSaleService } from './whole-sale.service';
import { WholeSaleController } from './whole-sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholeSaleEntity } from './entities/whole-sale.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([WholeSaleEntity]), JwtModule],
  controllers: [WholeSaleController],
  providers: [WholeSaleService],
})
export class WholeSaleModule {}
