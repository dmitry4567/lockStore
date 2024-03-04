import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColorEntity } from './entities/color.entity';
import { UpdateColorDto } from './dto/update-color.dto';
import { CreateFeatureDto } from 'src/feature/dto/create-feature.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(ColorEntity)
    private colorEntity: Repository<ColorEntity>,
  ) { }

  create(dto: CreateFeatureDto) {
    return this.colorEntity.save(dto);
  }

  findAll() {
    return this.colorEntity.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateColorDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}