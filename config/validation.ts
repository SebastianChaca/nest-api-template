import * as Joi from 'joi';
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  JWT_SECRET_KEY: Joi.string().required().default('secretkey'),
  JWT_EXPIRES_IN: Joi.string().required().default('1h'),
  PORT: Joi.number().default(3001),
  MONGO_DB: Joi.string().required(),
});
