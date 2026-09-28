import Joi from "joi";

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),

  newPassword: Joi.string().required(),

  otp: Joi.string().required(),
});

export default resetPasswordValidation;
