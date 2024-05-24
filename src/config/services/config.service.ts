import { Injectable } from '@nestjs/common';
import { AccountStatusEnum } from 'src/utils/enums/accountStatus.enum';
import { CountryEnum } from 'src/utils/enums/country.enum';
import { CountryCodeEnum } from 'src/utils/enums/countryCode.enum';
import { Currency } from 'src/utils/enums/currency.enum';
import { NigerianLocalGovernmentsEnum } from 'src/utils/enums/localgovernmentEnums/nigeria/localGovernments.enum';
import { PhoneCountryCodeEnum } from 'src/utils/enums/phoneCountryCodes.enum';
import { NigerStatesEnum } from 'src/utils/enums/stateEnums/niger/state.enum';
import { NigerianStatesEnum } from 'src/utils/enums/stateEnums/nigeria/states.enum';


@Injectable()
export class GenericService {
  getAllEnumsValues() {
    return {
      accountStatusEnum: Object.values(AccountStatusEnum),
      countryCodeAbvENum: Object.values(CountryEnum),
      currency: Object.values(Currency),
      countryCodeEnum: Object.values(CountryCodeEnum),
      phoneCountryCodeEnum: Object.values(PhoneCountryCodeEnum),
      nigeriaStateEnum:Object.values(NigerianStatesEnum),
      nigeriaLocalGovernmentsEnum:Object.values(NigerianLocalGovernmentsEnum)
    };
  }
}
