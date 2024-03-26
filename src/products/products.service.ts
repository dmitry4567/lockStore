import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import * as fs from 'fs';
import { ProductSearchDto } from './dto/search-dto';
import { PhotoItem } from '../photo-item/entities/photoItem.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from 'src/category/category.service';
import { FeatureService } from 'src/feature/feature.service';
import { ColorService } from 'src/color/color.service';
import { MaterialService } from 'src/material/material.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>,
    @InjectRepository(PhotoItem)
    private repository2: Repository<PhotoItem>,
    private readonly categoryService: CategoryService,
    private readonly featureService: FeatureService,
    private readonly colorService: ColorService,
    private readonly materialService: MaterialService,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryService.findOne(dto.categoryId);
    const feature = await this.featureService.findOne(dto.featureId);
    const color = await this.colorService.findOne(dto.colorId);
    const material = await this.materialService.findOne(dto.materialId);

    const product = new ProductEntity();
    product.title = dto.title;
    product.rate = dto.rate;
    product.price = dto.price;
    product.oldPrice = dto.oldPrice;
    product.category = category;
    product.feature = feature;
    product.color = color;
    product.material = material;

    await this.repository.save(product);

    return product;
  }

  async getProductById(id: number) {
    return await this.repository.findOneBy({ id: id });
  }

  async findAll(): Promise<ProductEntity[]> {
    const product = await this.repository.find({
      relations: {
        photoItems: true,
      },
    });

    return product;
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.repository.findOne({
      relations: {
        photoItems: true,
      },
      where: {
        id: id,
      },
    });

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

  async update(id: number, dto: UpdateProductDto) {
    const toUpdate = await this.findOne(id);
    Object.keys(dto).forEach((key: string) => {
      if (dto[key]) {
        toUpdate[key] = dto[key];
      }
    });
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
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException();
    }

    await this.repository2
      .createQueryBuilder()
      .delete()
      .where('productId = :productId', { productId: product.id })
      .execute();

    product.photoItems = [];

    await this.repository.save(product);

    return this.repository.delete({ id });
  }
}
