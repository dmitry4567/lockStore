import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './entities/color.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ColorEntity])],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
