import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './entities/color.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ColorEntity]), JwtModule],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService],
})
export class ColorModule {}
