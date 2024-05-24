import * as Joi from 'joi';

export const addressCoordinatesValidator = Joi.object({
  type: Joi.string().valid('Point').default('Point'),
  coordinates: Joi.array()
    .items(Joi.number())
    .min(0)
    .max(2)
    .error(
      () =>
        new Error(
          'please provide the [lat,long] for addressCoordinates.coordinates',
        ),
    ),
  elevation: Joi.string().trim().optional().allow(null),
});
