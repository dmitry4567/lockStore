import { BadRequestException, Injectable } from '@nestjs/common';
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
  ) {}

  create(dto: CreateFeatureDto) {
    return this.featureEntity.save(dto);
  }

  findAll() {
    return this.featureEntity.find();
  }

  findOne(id: number) {
    return this.featureEntity.findOneBy({ id });
  }

  async update(id: number, dto: UpdateFeatureDto) {
    const toUpdate = await this.featureEntity.findOneBy({ id });
    if (!toUpdate) {
      throw new BadRequestException(`Запись с id=${id} не найдена`);
    }
    if (dto.name) {
      toUpdate.name = dto.name;
    }
    return this.featureEntity.save(toUpdate);
  }

  remove(id: number) {
    return this.featureEntity.delete(id);
  }
}
