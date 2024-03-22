import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchDto } from './dto/search-dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/role/entities/role.entity';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth()
@Controller('cart')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: fileStorage }))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ProductEntity> {
    return this.productsService.create(dto, image);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/image/:path')
  download(@Param('path') path: string, @Res() response) {
    return response.sendFile(path, { root: './db_images/promo' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post('search')
  searchProducts(@Body() dto: ProductSearchDto): Promise<ProductEntity[]> {
    return this.productsService.searchProducts(dto);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: fileStorage }))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ProductEntity> {
    return this.productsService.update(+id, dto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}
