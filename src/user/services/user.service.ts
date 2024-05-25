import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { BaseService } from 'src/utils/database/db.service';
import { User, UserDoc } from '../model/user.model';
import { CreateUserDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponse } from 'src/utils/common/interfaces/apiResponse.interface';

@Injectable()
export class UserService extends BaseService<UserDoc, ''> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDoc>,
  ) {
    super(userModel);
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create({
      ...createUserDto,
    });
    return user;
  }

  async updateUser(userId: string, userData: CreateUserDto) {
    const existingUser = await this.userModel.findByIdAndUpdate(
      userId,
      userData,
      { new: true },
    );
    if (!existingUser) {
      throw new Error('User not found');
    }
    Object.assign(existingUser, userData);
    return existingUser.save();
  }

  async getUserById(userId: string) {
    const user = this.userModel.findOne({ userId });
    return {
      status: 'success',
      data: user,
    };
  }

  async getByEmail(email: string) {
    const user = this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('user email does not exist');
    }
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.findByIdAndUpdate(userId, { refreshToken });
  }
}
