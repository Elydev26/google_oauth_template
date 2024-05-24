import * as joi from 'joi';
export const createUserValidator = joi.object({
  firstName: joi.string().trim().required().messages({
    'firstName.base': `"first name" should be text`,
    'any.required': `"first name" is a required field`,
  }),
  lastName: joi.string().trim().required().messages({
    'lastName.base': `"last name" should be text`,
    'any.required': `"last name" is a required field`,
  }),
  email: joi.string().email().required().messages({
    // 'lastName.base': `"last name" should be text`,
    'any.required': `"email" is a required field`,
  }),
  password: joi
    .string()
    .min(8) // Minimum length of 8 characters
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    ) // Requires at least one lowercase letter, one uppercase letter, one digit, and one special character
    .message(
      '"{#label}" must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    ),
  confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
    'any.only': '"confirm Password" must match the "Password" field',
    'any.required': '"confirm Password" is required',
  })
});
