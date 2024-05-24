import { UserRoleEnum } from 'src/utils/enums/userRole.enum';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  facebookId?: string;
  displayName?: string;
  profilePicture: string;
  verified:boolean;
  password?: string;
  confirmPassword?: string;
  userRole?: UserRoleEnum;
  refreshToken?: string;
}
