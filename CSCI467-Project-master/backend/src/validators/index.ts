import Joi from 'joi';

// Password validation: 8 chars min, 1 special char
const passwordSchema = Joi.string()
  .min(8)
  .pattern(/[!@#$%^&*(),.?":{}|<>]/)
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters',
    'string.pattern.base': 'Password must contain at least 1 special character'
  });

export const validators = {
  // Auth
  register: Joi.object({
    email: Joi.string().email().required(),
    password: passwordSchema,
    name: Joi.string().min(2).required(),
    role: Joi.string().valid('ADMIN', 'WAREHOUSE_WORKER', 'RECEIVING_DESK').required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Products
  createProduct: Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    weight: Joi.number().positive().required(),
    pictureURL: Joi.string().uri().required(),
    quantity: Joi.number().integer().min(0).default(0)
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2),
    description: Joi.string().min(10),
    price: Joi.number().positive(),
    weight: Joi.number().positive(),
    pictureURL: Joi.string().uri(),
    quantity: Joi.number().integer().min(0)
  }).min(1),

  // Inventory
  addInventory: Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().positive().required()
  }),

  // Orders
  createOrder: Joi.object({
    customerName: Joi.string().min(2).required(),
    customerEmail: Joi.string().email().required(),
    shippingAddress: Joi.string().min(5).required(),
    shippingCity: Joi.string().min(2).required(),
    shippingState: Joi.string().min(2).required(),
    shippingZip: Joi.string().min(5).required(),
    shippingCountry: Joi.string().default('USA'),
    creditCard: Joi.string().creditCard().required(),
    creditCardName: Joi.string().min(2).required(),
    creditCardExpiry: Joi.string().pattern(/^\d{2}\/\d{4}$/).required(), // MM/YYYY
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().positive().required()
      })
    ).min(1).required()
  }),

  // Order search
  searchOrders: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    status: Joi.string().valid('ORDERED', 'PACKING', 'SHIPPED', 'CANCELLED'),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(Joi.ref('minPrice')),
    orderId: Joi.string().uuid(),
    customerEmail: Joi.string().email(),
    customerName: Joi.string()
  }),

  // Shipping brackets
  createShippingBracket: Joi.object({
    minWeight: Joi.number().min(0).required(),
    maxWeight: Joi.number().greater(Joi.ref('minWeight')).required(),
    cost: Joi.number().positive().required()
  }),

  updateShippingBracket: Joi.object({
    minWeight: Joi.number().min(0),
    maxWeight: Joi.number().positive(),
    cost: Joi.number().positive()
  }).min(1)
};
