import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
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

  async create(createUserDto: Partial<User>):Promise<UserDoc> {
    const user = await this.userModel.create({
      ...createUserDto,
    });
     return user
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<UserDoc> {
    const existingUser = await this.userModel.findByIdAndUpdate(userId, userData, { new: true });
    if (!existingUser) {
          throw new Error('User not found');
        }
      
        // Update user data
        Object.assign(existingUser, userData);
        return existingUser.save();
  }

  async getUserById(userId: string): Promise<ApiResponse<UserDoc>> {
    const user = await this.findByIdOrErrorOut(userId);
    return {
      status: 'success',
      data: user,
    };
  }

  findByEmail(email: string) :Promise<UserDoc> {
    const user = this.userModel.findOne({email});
    if (!user) {
    throw new BadRequestException('user email does not exist')
    }
    return user;
  }

  async updateRefreshToken(userId:string,refreshToken:string) {
   return await this.findByIdAndUpdate(userId,{refreshToken});
   
}
}
