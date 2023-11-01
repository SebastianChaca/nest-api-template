import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(User.name);
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log('Create user');
      createUserDto.password = this.authService.hasPassword(
        createUserDto.password,
      );
      const user = await this.userModel.create(createUserDto);
      const userObj = user.toObject();
      delete userObj.password;
      return {
        ...userObj,
        token: this.authService.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.logger.error('Create user error');
      //handle by unique constraing filter
      throw error;
    }
  }
}