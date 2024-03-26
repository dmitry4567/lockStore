import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureEntity } from './entities/feature.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([FeatureEntity]), JwtModule],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService]
})
export class FeatureModule {}
