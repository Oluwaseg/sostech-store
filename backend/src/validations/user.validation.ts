import Joi from 'joi';

export const editUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().email().lowercase().optional(),
  role: Joi.string().valid('user', 'admin', 'moderator').optional(),
  username: Joi.string().trim().min(2).max(50).optional(),
  avatar: Joi.object({
    publicId: Joi.string().trim().optional(),
    url: Joi.string().uri().optional(),
  }).optional(),
  bio: Joi.string().max(200).allow('', null).optional(),
  birthday: Joi.date().iso().allow('', null).optional(),
  phone: Joi.string().trim().allow('').optional(),
  isEmailVerified: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  referralCode: Joi.string().trim().uppercase().allow('').optional(),
});
