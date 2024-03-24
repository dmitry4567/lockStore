import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialService } from './material.service';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Roles('admin')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiTags('FEATURE')
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  create(@Body() createFeatureDto: CreateMaterialDto) {
    return this.materialService.create(createFeatureDto);
  }

  @Get()
  findAll() {
    return this.materialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeatureDto: UpdateMaterialDto) {
    return this.materialService.update(+id, updateFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialService.remove(+id);
  }
}
