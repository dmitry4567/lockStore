import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from './entities/material.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([MaterialEntity])],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule {}
