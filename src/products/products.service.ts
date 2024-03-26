import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { AddPhotosToProductDto } from './dto/add-photo-to-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import * as fs from 'fs';
import { ProductSearchDto } from './dto/search-dto';
import { PhotoItem } from './entities/photoItem.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdatePhotosToProductDto } from './dto/update-photos-to-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>,
    @InjectRepository(PhotoItem)
    private repository2: Repository<PhotoItem>,
  ) {}

  async create(dto: CreateProductDto) {
    return this.repository.save({
      title: dto.title,
      rate: dto.rate,
      price: dto.price,
      oldPrice: dto.oldPrice,
    });
  }

  async uploadPhotos(
    dto: AddPhotosToProductDto,
    photos: Express.Multer.File[],
  ) {
    const product = await this.repository.findOne({
      relations: {
        photoItems: true,
      },
      where: {
        id: dto.productId,
      },
    });

    if (!product) {
      throw new BadRequestException('Product no found');
    }

    const photoEntities = photos.map((photo) => {
      const photoEntity = new PhotoItem();

      photoEntity.fileName = photo.filename;
      photoEntity.product = product;
      return photoEntity;
    });

    return await this.repository2.save(photoEntities);
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

  async updatePhotosToProduct(
    id: number,
    dto: UpdatePhotosToProductDto,
    photos: Express.Multer.File[],
  ) {
    const toUpdate = await this.findOne(id);
    if (photos) {
      for (let i = 0; i < toUpdate.photoItems.length; i++) {
        fs.unlink(
          `db_images/photoProduct/${toUpdate.photoItems[i].fileName}`,
          (err) => {
            if (err) {
              console.error(err);
            }
          },
        );
        await this.repository2.delete({ id: toUpdate.photoItems[i].id });
      }

      const photoEntities = photos.map((photo) => {
        const photoEntity = new PhotoItem();

        photoEntity.fileName = photo.filename;
        photoEntity.product = toUpdate;
        return photoEntity;
      });

      await this.repository2.save(photoEntities);

      throw new HttpException('Фотограции обновлены', HttpStatus.OK);
    }
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
