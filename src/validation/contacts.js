import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base'  : 'The "{#label}" field must be a string',
    'string.empty' : 'The "{#label}" field cannot be empty',
    'string.min'   : 'The "{#label}" field must have at least {#limit} characters',
    'string.max'   : 'The "{#label}" field must have at most {#limit} characters',
    'any.required' : 'The "{#label}" field is required',
  }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base'  : 'The "{#label}" field must be a string',
    'string.empty' : 'The "{#label}" field cannot be empty',
    'string.min'   : 'The "{#label}" field must have at least {#limit} characters',
    'string.max'   : 'The "{#label}" field must have at most {#limit} characters',
    'any.required' : 'The "{#label}" field is required',
  }),
    email: Joi.string().min(3).max(20).email().messages({
    'string.base'  : 'The "{#label}" field must be a string',
    'string.empty' : 'The "{#label}" field cannot be empty',
    'string.min'   : 'The "{#label}" field must have at least {#limit} characters',
    'string.max'   : 'The "{#label}" field must have at most {#limit} characters',
    'string.email' : 'The "{#label}" field must be a valid email address',
  }),
    isFavourite: Joi.boolean().default(false).messages({
    'boolean.base' : 'The "{#label}" field must be a boolean (true/false)',
  }),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal').required().default('personal').messages({
      'string.base'  : 'The "{#label}" field must be a string',
      'string.empty' : 'The "{#label}" field cannot be empty',
      'string.min'   : 'The "{#label}" field must have at least {#limit} characters',
      'string.max'   : 'The "{#label}" field must have at most {#limit} characters',
      'any.only'     : 'The "{#label}" field must be one of: {#valids}',
      'any.required' : 'The "{#label}" field is required',
    }),
     userId: Joi.string().required().messages({
    'string.base'  : 'The "{#label}" field must be a string',
    'any.required' : 'The "{#label}" field is required',
  }).custom((value, helper) => {
        if (value && !isValidObjectId(value)) {
            return helper.message('Id is not valid');
        }
        return true;
    }),
});


export const updateContactSchema = Joi.object({
name: Joi.string().min(3).max(20).messages({
    'string.base'  : 'The "{#label}" field must be a string',
    'string.empty' : 'The "{#label}" field cannot be empty',
    'string.min'   : 'The "{#label}" field must have at least {#limit} characters',
    'string.max'   : 'The "{#label}" field must have at most {#limit} characters',
  }),
    phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base'  : 'The "{#label}" field must be a string',
    'string.empty' : 'The "{#label}" field cannot be empty',
    'string.min'   : 'The "{#label}" field must have at least {#limit} characters',
    'string.max'   : 'The "{#label}" field must have at most {#limit} characters',
  }),
    email: Joi.string().min(3).max(20).email().messages({
    'string.base'  : 'The "{#label}" field must be a string',
    'string.empty' : 'The "{#label}" field cannot be empty',
    'string.min'   : 'The "{#label}" field must have at least {#limit} characters',
    'string.max'   : 'The "{#label}" field must have at most {#limit} characters',
    'string.email' : 'The "{#label}" field must be a valid email address',
  }),
    isFavourite: Joi.boolean().default(false).messages({
    'boolean.base' : 'The "{#label}" field must be a boolean (true/false)',
  }),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal').default('personal').messages({
      'string.base'  : 'The "{#label}" field must be a string',
      'string.empty' : 'The "{#label}" field cannot be empty',
      'string.min'   : 'The "{#label}" field must have at least {#limit} characters',
      'string.max'   : 'The {#label} field must have at most {#limit} characters',
      'any.only'     : 'The "{#label}" field must be one of: {#valids}',
    }),
   userId: Joi.string().messages({
    'string.base'  : 'The "{#label}" field must be a string',
    'any.required' : 'The "{#label}" field is required',
  }).custom((value, helper) => {
        if (value && !isValidObjectId(value)) {
            return helper.message('Id is not valid');
        }
        return true;
    }),
});

export const contactQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base'   : 'The "{#label}" must be a number',
    'number.integer': 'The "{#label}" must be an integer',
    'number.min'    : 'The "{#label}" must be at least {#limit}',
  }),
  perPage: Joi.number().integer().min(1).default(10).messages({
    'number.base'   : 'The "{#label}" must be a number',
    'number.integer': 'The "{#label}" must be an integer',
    'number.min'    : 'The "{#label}" must be at least {#limit}',
  }),
  isFavourite: Joi.boolean().truthy('true','1','yes','y')
    .falsy('false','0','no','n').messages({
      'boolean.base': 'The "{#label}" must be a boolean (true/false, 1/0, yes/no, y/n)',
    }),
  type: Joi.string().valid('work', 'home', 'personal').messages({
      'string.base': 'The "{#label}" must be a string',
      'any.only'   : 'The "{#label}" must be one of [work, home, personal]',
    }),
  sortBy: Joi.string()
    .valid('_id','name','email','phoneNumber','contactType','isFavourite','createdAt','updatedAt')
    .default('name').messages({
      'string.base': 'The "{#label}" must be a string',
      'any.only'   : 'The "{#label}" must be one of [_id, name, email, phoneNumber, contactType, isFavourite, createdAt, updatedAt]',
    }),
  sortOrder: Joi.string().valid('asc','desc').insensitive().default('asc').messages({
      'string.base': 'The "{#label}" must be a string',
      'any.only'   : 'The "{#label}" must be "asc" or "desc"',
    }),
});


