import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureEntity } from './entities/feature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(FeatureEntity)
    private featureEntity: Repository<FeatureEntity>,
  ) { }

  create(dto: CreateFeatureDto) {
    return this.featureEntity.save(dto);
  }

  findAll() {
    return this.featureEntity.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateFeatureDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}