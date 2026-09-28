import Joi from "joi";

const resendValidation = Joi.object({
  email: Joi.string().email().required(),

  purpose: Joi.string().valid("emailVerification", "resetPassword").required(),
});

export default resendValidation;
