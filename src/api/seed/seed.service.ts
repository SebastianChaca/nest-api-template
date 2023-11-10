import { Inject, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { users } from './data/user';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { DEVELOPMENT, NODE_ENV } from 'src/common/constants/envvars';

@Injectable()
export class SeedService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}
  async create() {
    if (this.configService.get(NODE_ENV) === DEVELOPMENT) {
      try {
        await this.emptyDB();
        await this.createSeed();
        return 'ok';
      } catch (error) {
        throw error;
      }
    } else {
      return 'Seed only works in development mode';
    }
  }

  async createSeed() {
    try {
      const createUsers = users.map(
        async (user) => await this.userService.create(user),
      );
      await Promise.all(createUsers);
      return 'seed';
    } catch (error) {
      throw error;
    }
  }

  async emptyDB() {
    try {
      await this.userModel.deleteMany();
    } catch (error) {
      throw error;
    }
  }
}
