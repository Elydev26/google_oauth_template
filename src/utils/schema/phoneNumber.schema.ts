import { Prop } from '@nestjs/mongoose';
import { CountryCodeEnum } from '../enums/countryCode.enum';


export class PhoneNumberSchema {
  @Prop({ enum: Object.values(CountryCodeEnum) })
  code: CountryCodeEnum;
  @Prop()
  number: string;
  @Prop()
  local: string;
}
