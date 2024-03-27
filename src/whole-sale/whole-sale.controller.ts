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
import { WholeSaleService } from './whole-sale.service';
import { CreateWholeSaleDto } from './dto/create-whole-sale.dto';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';
import { UpdateWholeSaleDto } from './dto/update-whole-sale.dto copy';

@ApiTags('WHOLESALE')
@Controller('wholesale')
export class WholeSaleController {
  constructor(private readonly wholeSaleService: WholeSaleService) { }

  @Post()
  create(@Body() createWholeSaleDto: CreateWholeSaleDto) {
    return this.wholeSaleService.create(createWholeSaleDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.wholeSaleService.findAll();
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wholeSaleService.findOne(+id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateWholeSaleDto,
  ) {
    return this.wholeSaleService.update(+id, updateFeatureDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wholeSaleService.remove(+id);
  }
}
