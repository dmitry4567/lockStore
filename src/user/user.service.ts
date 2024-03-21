import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEnitity } from './entities/user.entity';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEnitity)
    private readonly userRepository: Repository<UserEnitity>,
    private readonly cartService: CartService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEnitity> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(
        `Пользователь с email: ${dto.email} уже существует`,
      );
    }

    const user = await this.userRepository.save(dto);
    const cart = await this.cartService.createCart(user);
    user.cart = cart;
    await this.userRepository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<UserEnitity> {
    return this.userRepository.findOneBy({ email: email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async findById(id: number) {
    return this.userRepository.findOneBy({
      id,
    });
  }

  async remove(req: any): Promise<DeleteResult> {
    // await this.cartService.removeCart(req.user.id);

    return await this.userRepository.delete(req.user.id);
  }
}
