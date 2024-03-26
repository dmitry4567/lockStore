import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColorEntity } from './entities/color.entity';
import { UpdateColorDto } from './dto/update-color.dto';
import { CreateFeatureDto } from 'src/feature/dto/create-feature.dto';
import { CreateColorDto } from './dto/create-color.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(ColorEntity)
    private colorEntity: Repository<ColorEntity>,
  ) { }

  create(dto: CreateColorDto) {
    return this.colorEntity.save(dto);
  }

  findAll() {
    return this.colorEntity.find();
  }

  findOne(id: number) {
    return this.colorEntity.findOneBy({ id });
  }

  async update(id: number, dto: UpdateColorDto) {
    const toUpdate = await this.colorEntity.findOneBy({ id });
    if (!toUpdate) {
      throw new BadRequestException(`Запись с id=${id} не найдена`);
    }
    if (dto.name) {
      toUpdate.name = dto.name;
    }
    return this.colorEntity.save(toUpdate);
  }

  remove(id: number) {
    return this.colorEntity.delete(id);
  }
}