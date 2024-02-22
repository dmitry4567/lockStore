import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: LoginDto): Promise<any> {
    const user = await this.userService.create(registerDto);
    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || loginDto.password !== user.password) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}