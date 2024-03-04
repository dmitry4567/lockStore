import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import * as fs from 'fs';
import { ProductSearchDto } from './dto/search-dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateProductDto, image: Express.Multer.File) {
    return this.repository.save({
      image: image.filename,
      title: dto.title,
      rate: dto.rate,
      price: dto.price,
      oldPrice: dto.oldPrice,
    });
  }

  async getProductById(id: number) {
    return await this.repository.findOneBy({ id: id });
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.repository.findOneBy({ id });
    if (!product) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'A product with such an ID does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto, image: Express.Multer.File) {
    const toUpdate = await this.findOne(id);
    Object.keys(dto).forEach((key: string) => {
      if (dto[key]) {
        toUpdate[key] = dto[key];
      }
    });
    if (image) {
      if (toUpdate.image !== image.filename) {
        fs.unlink(`db_images/promo/${toUpdate.image}`, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      toUpdate.image = image.filename;
    }
    return this.repository.save(toUpdate);
  }

  async searchProducts(data: ProductSearchDto): Promise<ProductEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('products');

    queryBuilder.leftJoinAndSelect('products.category', 'category');
    queryBuilder.leftJoinAndSelect('products.feature', 'feature');
    queryBuilder.leftJoinAndSelect('products.color', 'color');
    queryBuilder.leftJoinAndSelect('products.material', 'material');

    if (data.categoryid) {
      const categories = data.categoryid.split(',').map((x) => +x);
      queryBuilder.where('category.id IN (:...categories)', { categories });
    }

    if (data.featureid) {
      const features = data.featureid.split(',').map((x) => +x);
      queryBuilder.where('feature.id IN (:...features)', { features });
    }

    if (data.colorid) {
      const colorid = data.colorid;
      queryBuilder.where('color.id = :colorid', { colorid });
    }

    if (data.materialid) {
      const materialid = data.materialid;
      queryBuilder.where('material.id = :materialid', { materialid });
    }

    if (data.title) {
      queryBuilder.andWhere('title LIKE :title', { title: `%${data.title}%` });
    }

    if (data.priceMin && typeof data.priceMin === 'number') {
      queryBuilder.andWhere('price >= :min', { min: data.priceMin });
    }

    if (data.priceMax && typeof data.priceMax === 'number') {
      queryBuilder.andWhere('price <= :max', { max: data.priceMax });
    }

    const products = await queryBuilder.getMany();

    if (products.length === 0) {
      throw new NotFoundException();
    }

    return products;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }
}
