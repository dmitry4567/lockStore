import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Res,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { ProductsService } from './products.service';
import { AddPhotosToProductDto } from './dto/add-photo-to-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchDto } from './dto/search-dto';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdatePhotosToProductDto } from './dto/update-photos-to-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';

@ApiTags('PRODUCTS')
@Controller('products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('addProduct')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/upload-photos')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 20, { storage: fileStorage }))
  async uploadPhotos(
    @Body() dto: AddPhotosToProductDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.productsService.uploadPhotos(dto, photos);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/image/:path')
  download(@Param('path') path: string, @Res() response) {
    return response.sendFile(path, { root: './db_images/photoProduct' });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiTags('SEARCH')
  @Post('search')
  searchProducts(@Body() dto: ProductSearchDto): Promise<ProductEntity[]> {
    return this.productsService.searchProducts(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('updateProduct/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.update(+id, dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('updatePhotosToProduct/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 20, { storage: fileStorage }))
  updatePhotosToProduct(
    @Param('id') id: string,
    @Body() dto: UpdatePhotosToProductDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.productsService.updatePhotosToProduct(+id, dto, photos);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}
