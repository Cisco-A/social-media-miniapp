import Joi from "joi";

const registerValidation = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  displayName: Joi.string().required(),

  // username: Joi.string()
  // .optional(),

  bio: Joi.string().max(500).optional(),

  gender: Joi.string().valid("male", "female").required(),

  avatarUrl: Joi.string().uri().optional(),
});

export default registerValidation;
