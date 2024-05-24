import * as Joi from 'joi';

export const dateOfBirthValidator = Joi.date().required().messages({
  'date.base': `"date of birth" should be a valid date`,
  'any.required': `"date of birth" is a required field`,
});

export const ddmmyyDateValidator = Joi.date()
  .messages({
    'date.base': `"date of birth" should be a valid date`,
    'any.required': `"date of birth" is a required field`,
  });
  export const startsDateValidator = Joi.date()
  .messages({
    'date.base': `"start date" should be a valid date`,
    'any.required': `"start date" is a required field`,
  });

  export const endsDateValidator = Joi.date()
  .messages({
    'date.base': `"end date" should be a valid date`,
    'any.required': `"end date" is a required field`,
  });