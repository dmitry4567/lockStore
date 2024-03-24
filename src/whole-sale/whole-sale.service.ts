import { Injectable } from '@nestjs/common';
import { CreateWholeSaleDto } from './dto/create-whole-sale.dto';
import { WholeSaleEntity } from './entities/whole-sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WholeSaleService {
  constructor(
    @InjectRepository(WholeSaleEntity)
    private wholeSaleRepository: Repository<WholeSaleEntity>,
  ) {}

  async create(dto: CreateWholeSaleDto) {
    return this.wholeSaleRepository.save(dto);
  }

  async findAll() {
    return this.wholeSaleRepository.find();
  }

  async findOne(id: number) {
    return this.wholeSaleRepository.findOneBy({
      id,
    });
  }

  async remove(id: number) {
    return this.wholeSaleRepository.delete(id);
  }
}
