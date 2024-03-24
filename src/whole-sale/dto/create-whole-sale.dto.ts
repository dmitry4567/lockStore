import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateWholeSaleDto {
  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  nameCompany: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  nameProduct: string;

  @ApiProperty()
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsBoolean()
  logo: boolean;

  @ApiProperty()
  @IsBoolean()
  installWork: boolean;
}
