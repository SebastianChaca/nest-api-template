import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { hashSync, compareSync } from 'bcrypt';
import { User } from 'src/api/user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto copy';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  hasPassword(password: string) {
    return hashSync(password, 10);
  }
  comparePassword(password: string, passwordModel: string) {
    return compareSync(password, passwordModel);
  }
  getJwtToken(payload: JwtPayload) {
    //generar token
    return this.jwtService.sign(payload);
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    this.logger.log('Login user');
    const user = await this.userModel.findOne({ email });

    if (!user || !this.comparePassword(password, user.password))
      throw new UnauthorizedException('credentials are not valid');

    const userObj = user.toObject();
    delete userObj.password;
    return {
      ...userObj,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }
}
