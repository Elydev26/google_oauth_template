import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { schemaConfig } from 'src/utils/database/schema.config';
import { UserRoleEnum } from 'src/utils/enums/userRole.enum';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import mongoose from 'mongoose';
import { AccountStatusEnum } from 'src/utils/enums/accountStatus.enum';

@Schema(schemaConfig)
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  profilePicture: string;

  @Prop()
  facebookId?: string;

  @Prop()
  googleId?: String

  @Prop()
  displayName?: string;

  @Prop({ enum: Object.values(UserRoleEnum) })
  userRole: UserRoleEnum;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({
    enum: Object.values(AccountStatusEnum),
    default: AccountStatusEnum.Active,
  })
  accountStatus: AccountStatusEnum;

  static async isValidPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, hash);
      if (!result) {
        return false;
      }
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}

export type UserDoc = User & mongoose.Document;
export const UserModel = SchemaFactory.createForClass(User);
