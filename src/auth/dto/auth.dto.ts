import { UserRoleEnum } from "src/utils/enums/userRole.enum";

export class LoginDto {
  email: string;
  password: string;
}
export class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string
    password: string;
    verified:boolean;
    confirmPassword: string;
    userRole?: UserRoleEnum;
    refreshToken?: string;
    googleId: String
  }

export class RefreshAccessTokenDto {
    refreshToken:string
}

export class GoogleAuthDto {
  
}