import Joi from "joi";

export const createContactSchema = Joi.object({
name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).email(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal').required().default('personal'),
});


export const updateContactSchema = Joi.object({
name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20).email(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal').default('personal'),
});

export const contactQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(1).default(10),
  isFavourite: Joi.boolean().truthy('true','1','yes','y')
    .falsy('false','0','no','n'),
  type: Joi.string().valid('work', 'home', 'personal'),
  sortBy: Joi.string()
    .valid('_id','name','email','phoneNumber','contactType','isFavourite','createdAt','updatedAt')
    .default('name'),
  sortOrder: Joi.string().valid('asc','desc').insensitive().default('asc'),
});


