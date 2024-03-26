import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWholeSaleDto } from './dto/create-whole-sale.dto';
import { WholeSaleEntity } from './entities/whole-sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateWholeSaleDto } from './dto/update-whole-sale.dto copy';

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

  async update(id: number, dto: UpdateWholeSaleDto) {
    const toUpdate = await this.wholeSaleRepository.findOneBy({ id });

    if (!toUpdate) {
      throw new BadRequestException(`Запись с id=${id} не найдена`);
    }

    if (dto.count) {
      toUpdate.count = dto.count;
    }
    if (dto.firstname) {
      toUpdate.firstname = dto.firstname;
    }
    if (dto.installWork !== undefined) {
      toUpdate.installWork = dto.installWork;
    }
    if (dto.logo !== undefined) {
      toUpdate.logo = dto.logo;
    }
    if (dto.nameCompany) {
      toUpdate.nameCompany = dto.nameCompany;
    }
    if (dto.nameProduct) {
      toUpdate.nameProduct = dto.nameProduct;
    }
    if (dto.phone) {
      toUpdate.phone = dto.phone;
    }

    return this.wholeSaleRepository.save(toUpdate);
  }

  async remove(id: number) {
    return this.wholeSaleRepository.delete(id);
  }
}
