import * as Joi from 'joi';
import { LocalGovernmentsEnum } from '../enums/localgovernmentEnums/index.enum';

export const localGovernmentValidator = Joi.string().valid(
  ...Object.values(LocalGovernmentsEnum),
);
