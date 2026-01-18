import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50).messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 50 characters',
  }),
  email: Joi.string().required().email().lowercase().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  referralCode: Joi.string().optional().uppercase().trim().messages({
    'string.base': 'Referral code must be a string',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email().lowercase().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().required().email().lowercase().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Verification token is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Reset token is required',
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
});
