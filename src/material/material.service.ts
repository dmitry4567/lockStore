import { Injectable } from '@nestjs/common';
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
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateMaterialDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}