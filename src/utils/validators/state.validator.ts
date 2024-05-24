import * as Joi from 'joi';
import { StateEnum } from 'src/utils/enums/stateEnums/index.enum';
export const stateValidator = Joi.string().valid(...Object.values(StateEnum));
