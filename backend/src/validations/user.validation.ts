import Joi from 'joi';

export const editUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  email: Joi.string().email().lowercase(),
  role: Joi.string().valid('user', 'admin', 'moderator'),
  username: Joi.string().trim().min(2).max(50),
  avatar: Joi.object({
    publicId: Joi.string().trim().optional(),
    url: Joi.string().uri().optional(),
  }).optional(),
  bio: Joi.string().max(200).allow('', null),
  birthday: Joi.date().iso().optional(),
  phone: Joi.string().trim().optional(),
  isEmailVerified: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  referralCode: Joi.string().trim().uppercase().optional(),
});
