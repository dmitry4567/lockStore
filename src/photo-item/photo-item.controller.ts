import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PhotoItemService } from './photo-item.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AddPhotosToProductDto } from './dto/add-photo-to-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/decorators/role.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { UpdatePhotosToProductDto } from './dto/update-photos-to-product.dto';

@ApiTags('PHOTO_ITEM')
@Controller('photoItem')
export class PhotoItemController {
  constructor(private readonly photoItemService: PhotoItemService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/upload-photos/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 20, { storage: fileStorage }))
  async uploadPhotos(
    @Body() dto: AddPhotosToProductDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.photoItemService.uploadPhotos(dto, photos);
  }

  @Get('/product/:path')
  download(@Param('path') path: string, @Response() response) {
    return response.sendFile(path, { root: './db_images/photoProduct' });
  }

  @Get()
  findAll() {
    return this.photoItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoItemService.findOne(+id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('updatePhotosToProduct/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 20, { storage: fileStorage }))
  updatePhotosToProduct(
    @Param('id') id: string,
    @Body() dto: UpdatePhotosToProductDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.photoItemService.updatePhotosToProduct(+id, dto, photos);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoItemService.delete(+id);
  }
}
