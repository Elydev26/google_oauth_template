import { AccountStatusEnum } from "src/utils/enums/accountStatus.enum";
import { UserRoleEnum } from "src/utils/enums/userRole.enum";


export class DeviceTokenDto {
  serialNumber: string;
}

export class UserTokenDto {
  id: string;
  accountStatus: AccountStatusEnum;
  userRole:UserRoleEnum
  verfired:boolean
}

export class UserIdDto {
  id: string;
}
