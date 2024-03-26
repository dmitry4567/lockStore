import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AddPhotosToProductDto } from './dto/add-photo-to-product.dto';
import { PhotoItem } from 'src/photo-item/entities/photoItem.entity';
import { UpdatePhotosToProductDto } from './dto/update-photos-to-product.dto';
import * as fs from 'fs';
import { ProductsService } from 'src/products/products.service';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PhotoItemService {
  constructor(
    @InjectRepository(PhotoItem)
    private photoItemRepository: Repository<PhotoItem>,
    private productSerive: ProductsService,
  ) {}

  async uploadPhotos(
    dto: AddPhotosToProductDto,
    photos: Express.Multer.File[],
  ) {
    const product = await this.productSerive.findOne(dto.productId);

    if (!product) {
      throw new BadRequestException('Product no found');
    }

    const photoEntities = photos.map((photo) => {
      const photoEntity = new PhotoItem();

      photoEntity.fileName = photo.filename;
      photoEntity.product = product;
      return photoEntity;
    });

    return await this.photoItemRepository.save(photoEntities);
  }

  async findAll() {
    return await this.photoItemRepository.find();
  }

  async findOne(id: number) {
    const photoItem = await this.photoItemRepository.findOneBy({ id });

    if (!photoItem) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'A photoItem with such an ID does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return photoItem;
  }

  async updatePhotosToProduct(
    id: number,
    dto: UpdatePhotosToProductDto,
    photos: Express.Multer.File[],
  ) {
    const toUpdate = await this.productSerive.findOne(id);
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
        await this.photoItemRepository.delete({
          id: toUpdate.photoItems[i].id,
        });
      }

      const photoEntities = photos.map((photo) => {
        const photoEntity = new PhotoItem();

        photoEntity.fileName = photo.filename;
        photoEntity.product = toUpdate;
        return photoEntity;
      });

      await this.photoItemRepository.save(photoEntities);

      throw new HttpException('Фотограции обновлены', HttpStatus.OK);
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    const photoItem = await this.findOne(id);

    fs.unlink(
      `db_images/photoProduct/${photoItem.fileName}`,
      (err) => {
        if (err) {
          console.error(err);
        }
      },
    );

    return this.photoItemRepository.delete({ id });
  }
}
