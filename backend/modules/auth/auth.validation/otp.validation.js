import Joi from 'joi';

const otpValidation = Joi.object({
  email: Joi.string()
    .email()
    .required(),


  otp: Joi.string()
    .required(),

});

export default otpValidation;

