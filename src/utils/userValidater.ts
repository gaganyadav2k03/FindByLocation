import Joi from "joi";
export const validateSchema=Joi.object({
    email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  number: Joi.number().integer().min(1000000000).max(9999999999).required(),
  longitude: Joi.required(),
  latitude: Joi.required(),
})