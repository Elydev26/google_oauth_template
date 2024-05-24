import * as Joi from 'joi';
import { Types } from 'mongoose';

export const objectIdValidator = Joi.string()
  .trim()
  .custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) {
      return value;
    }
    return helpers.message({
      custom: 'please provide a valid object id',
    });
    // throw new Error('please provide a valid object id ');
  });

 
