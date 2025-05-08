import { checkSchema } from 'express-validator';

// User validators
export const loginValidator = checkSchema({
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Please provide a valid email address',
    },
    normalizeEmail: true,
    trim: true,
  },
  password: {
    in: ['body'],
    isString: {
      errorMessage: 'Password must be a string',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
  },
});

export const createUserValidator = checkSchema({
  role: {
    in: ['body'],
    isIn: {
      options: [['admin', 'seller', 'customer']],
      errorMessage: 'Role must be admin, seller, or customer',
    },
  },
  name: {
    in: ['body'],
    isString: {
      errorMessage: 'Name must be a string',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Name is required',
    },
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Please provide a valid email address',
    },
    normalizeEmail: true,
    trim: true,
  },
  password: {
    in: ['body'],
    isString: {
      errorMessage: 'Password must be a string',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
  },
});

export const updatePasswordValidator = checkSchema({
  currentPassword: {
    in: ['body'],
    isString: {
      errorMessage: 'Current password must be a string',
    },
    notEmpty: {
      errorMessage: 'Current password is required',
    },
  },
  newPassword: {
    in: ['body'],
    isString: {
      errorMessage: 'New password must be a string',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'New password must be at least 6 characters long',
    },
    notEmpty: {
      errorMessage: 'New password is required',
    },
  },
});

// Seller validators
export const createSellerValidator = checkSchema({
  firstName: {
    in: ['body'],
    isString: {
      errorMessage: 'First name must be a string',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'First name is required',
    },
  },
  lastName: {
    in: ['body'],
    isString: {
      errorMessage: 'Last name must be a string',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Last name is required',
    },
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Please provide a valid email address',
    },
    normalizeEmail: true,
    trim: true,
  },
  phone: {
    in: ['body'],
    isString: {
      errorMessage: 'Phone must be a string',
    },
    notEmpty: {
      errorMessage: 'Phone is required',
    },
  },
  identification: {
    in: ['body'],
    isString: {
      errorMessage: 'Identification must be a string',
    },
    notEmpty: {
      errorMessage: 'Identification is required',
    },
  },
  preferredLanguages: {
    in: ['body'],
    isArray: {
      errorMessage: 'Preferred languages must be an array',
    },
    notEmpty: {
      errorMessage: 'At least one preferred language is required',
    },
  },
  username: {
    in: ['body'],
    isString: {
      errorMessage: 'Username must be a string',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Username is required',
    },
  },
  password: {
    in: ['body'],
    isString: {
      errorMessage: 'Password must be a string',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
  },
});

export const updateSellerValidator = checkSchema({
  firstName: {
    in: ['body'],
    isString: {
      errorMessage: 'First name must be a string',
    },
    trim: true,
    optional: true,
  },
  lastName: {
    in: ['body'],
    isString: {
      errorMessage: 'Last name must be a string',
    },
    trim: true,
    optional: true,
  },
  phone: {
    in: ['body'],
    isString: {
      errorMessage: 'Phone must be a string',
    },
    optional: true,
  },
  profilePicture: {
    in: ['body'],
    isString: {
      errorMessage: 'Profile picture must be a string URL',
    },
    optional: true,
  },
  bio: {
    in: ['body'],
    isString: {
      errorMessage: 'Bio must be a string',
    },
    optional: true,
  },
  socialLinks: {
    in: ['body'],
    isObject: {
      errorMessage: 'Social links must be an object',
    },
    optional: true,
  },
  preferredLanguages: {
    in: ['body'],
    isArray: {
      errorMessage: 'Preferred languages must be an array',
    },
    optional: true,
  },
  business: {
    in: ['body'],
    isObject: {
      errorMessage: 'Business must be an object',
    },
    optional: true,
  },
});

export const updateSellerStatusValidator = checkSchema({
  status: {
    in: ['body'],
    isIn: {
      options: [['Pending', 'Approved', 'Rejected']],
      errorMessage: 'Status must be Pending, Approved, or Rejected',
    },
  },
});

// Customer validators
export const createCustomerValidator = checkSchema({
  firstName: {
    in: ['body'],
    isString: {
      errorMessage: 'First name must be a string',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'First name is required',
    },
  },
  lastName: {
    in: ['body'],
    isString: {
      errorMessage: 'Last name must be a string',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Last name is required',
    },
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Please provide a valid email address',
    },
    normalizeEmail: true,
    trim: true,
  },
  phone: {
    in: ['body'],
    isString: {
      errorMessage: 'Phone must be a string',
    },
    notEmpty: {
      errorMessage: 'Phone is required',
    },
  },
  password: {
    in: ['body'],
    isString: {
      errorMessage: 'Password must be a string',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
  },
});

export const updateCustomerValidator = checkSchema({
  firstName: {
    in: ['body'],
    isString: {
      errorMessage: 'First name must be a string',
    },
    trim: true,
    optional: true,
  },
  lastName: {
    in: ['body'],
    isString: {
      errorMessage: 'Last name must be a string',
    },
    trim: true,
    optional: true,
  },
  phone: {
    in: ['body'],
    isString: {
      errorMessage: 'Phone must be a string',
    },
    optional: true,
  },
  address: {
    in: ['body'],
    isString: {
      errorMessage: 'Address must be a string',
    },
    optional: true,
  },
  interests: {
    in: ['body'],
    isArray: {
      errorMessage: 'Interests must be an array',
    },
    optional: true,
  },
});

// Property validators
export const createPropertyValidator = checkSchema({
  title: {
    in: ['body'],
    isString: {
      errorMessage: 'Title must be a string',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Title is required',
    },
  },
  type: {
    in: ['body'],
    isIn: {
      options: [['Residential', 'Commercial', 'Industrial']],
      errorMessage: 'Type must be Residential, Commercial, or Industrial',
    },
  },
  description: {
    in: ['body'],
    isString: {
      errorMessage: 'Description must be a string',
    },
    notEmpty: {
      errorMessage: 'Description is required',
    },
  },
  address: {
    in: ['body'],
    isObject: {
      errorMessage: 'Address must be an object',
    },
    custom: {
      options: (value) => {
        return (
          value &&
          typeof value.house === 'string' &&
          typeof value.street === 'string' &&
          typeof value.city === 'string' &&
          typeof value.postalCode === 'string'
        );
      },
      errorMessage:
        'Address must include house, street, city, and postalCode as strings',
    },
  },
  price: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Price must be a number',
    },
  },
  images: {
    in: ['body'],
    isArray: {
      errorMessage: 'Images must be an array',
    },
    notEmpty: {
      errorMessage: 'At least one image is required',
    },
  },
});

export const updatePropertyValidator = checkSchema({
  title: {
    in: ['body'],
    isString: {
      errorMessage: 'Title must be a string',
    },
    trim: true,
    optional: true,
  },
  type: {
    in: ['body'],
    isIn: {
      options: [['Residential', 'Commercial', 'Industrial']],
      errorMessage: 'Type must be Residential, Commercial, or Industrial',
    },
    optional: true,
  },
  description: {
    in: ['body'],
    isString: {
      errorMessage: 'Description must be a string',
    },
    optional: true,
  },
  address: {
    in: ['body'],
    isObject: {
      errorMessage: 'Address must be an object',
    },
    optional: true,
  },
  price: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Price must be a number',
    },
    optional: true,
  },
  discountPrice: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Discount price must be a number',
    },
    optional: true,
  },
  beds: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Beds must be a number',
    },
    optional: true,
  },
  baths: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Baths must be a number',
    },
    optional: true,
  },
  options: {
    in: ['body'],
    isObject: {
      errorMessage: 'Options must be an object',
    },
    optional: true,
  },
  images: {
    in: ['body'],
    isArray: {
      errorMessage: 'Images must be an array',
    },
    optional: true,
  },
});

export const updatePropertyAvailabilityValidator = checkSchema({
  forSale: {
    in: ['body'],
    isBoolean: {
      errorMessage: 'For sale must be a boolean',
    },
  },
});

// Chat validators
export const createChatValidator = checkSchema({
  role: {
    in: ['body'],
    isString: {
      errorMessage: 'Role must be a string',
    },
    notEmpty: {
      errorMessage: 'Role is required',
    },
  },
});

export const addMessageValidator = checkSchema({
  text: {
    in: ['body'],
    isString: {
      errorMessage: 'Text must be a string',
    },
    notEmpty: {
      errorMessage: 'Text is required',
    },
  },
  fromBot: {
    in: ['body'],
    isBoolean: {
      errorMessage: 'FromBot must be a boolean',
    },
  },
});