import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialEntity } from './entities/material.entity';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { CreateMaterialDto } from './dto/create-material.dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(MaterialEntity)
    private materialEntity: Repository<MaterialEntity>,
  ) { }


  create(dto: CreateMaterialDto) {
    return this.materialEntity.save(dto);
  }

  findAll() {
    return this.materialEntity.find();
  }

  findOne(id: number) {
    return this.materialEntity.findOneBy({ id });
  }

  async update(id: number, dto: UpdateMaterialDto) {
    const toUpdate = await this.materialEntity.findOneBy({ id });
    if (!toUpdate) {
      throw new BadRequestException(`Запись с id=${id} не найдена`);
    }
    if (dto.name) {
      toUpdate.name = dto.name;
    }
    return this.materialEntity.save(toUpdate);
  }

  remove(id: number) {
    return this.materialEntity.delete(id);
  }
}