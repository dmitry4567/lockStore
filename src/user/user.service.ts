import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEnitity } from './entities/user.entity';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEnitity)
    private readonly userRepository: Repository<UserEnitity>,
    private readonly cartService: CartService,
  ) { }

    async create(dto: CreateUserDto): Promise<UserEnitity> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(
        `Пользователь с email: ${dto.email} уже существует`,
      );
    }

    const user = await this.userRepository.save(dto); // Сохраняем пользователя

    // Создаем корзину после регистрации
    const cart = await this.cartService.createCart(user);
    user.cart = cart;

    await this.userRepository.save(user); // Обновляем пользователя с корзиной

    return user;
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
