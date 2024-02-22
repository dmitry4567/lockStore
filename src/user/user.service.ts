import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEnitity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEnitity)
    private readonly userRepository: Repository<UserEnitity>,
  ) { }

  async create(dto: CreateUserDto): Promise<UserEnitity> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(
        `Пользователь с email: ${dto.email} уже существует`,
      );
    }

    return this.userRepository.save(dto);
  }

  async findByEmail(email: string): Promise<UserEnitity> {
    return this.userRepository.findOneBy({ email: email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
