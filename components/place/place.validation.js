const joi = require('@hapi/joi');

const placeFieldsSchema = {
  name: joi.string()
    .trim()
    .lowercase()
    .ruleset
    .min(2)
    .max(50)
    .rule({ message: 'place name must be at least 2 to 50 characters long' }),
  description: joi.string()
    .trim()
    .max(255)
    .allow('')
};

const ownerSchema = {
  email: joi.string()
    .required()
    .email()
    .lowercase()
    .message('Invalid email'),
  password: joi.string()
    .required()
    .trim()
    .pattern(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .message('Owner password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character')
};


const paginationSchema = {
  pageNo: joi.string()
    .required()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number'),
  limitNo: joi.string()
    .required()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number')
};

const searchSchema = {
  placeName: placeFieldsSchema.name.min(1)
    .allow(''),
  categoryName: placeFieldsSchema.name,
  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

const branchSchema = {
  name: joi.string()
    .required()
    .trim()
    .max(250)
    .message('Branch name must not exceed 250 characters'),
  city: joi.string()
    .required()
    .trim()
    .message('Enter a valid city'),
  area: joi.string()
    .required()
    .trim()
    .message('Enter a valid area'),
  street: joi.string()
    .required()
    .trim()
    .message('Enter a valid street'),
  building: joi.string()
    .trim()
    .message('Enter a valid building'),
  floor: joi.string()
    .trim()
    .message('Enter a valid floor'),
  phones: joi.string()
    .trim()
    .message('Enter a valid phone')
    .allow(''),
  otherDetails: joi.string()
    .trim()
    .message('Enter valid details')
    .allow('')
};

const getPlacesSchema = {
  pageNo: searchSchema.pageNo,
  limitNo: searchSchema.limitNo,
  sortBy: joi.string()
    .pattern(/^rate$|^default$/)
    .message('Sorting value must be either rate or default'),
  order: joi.string()
    .pattern(/^asc$|^desc$/)
    .message('Order value must be either asc or desc'),
  placeName: placeFieldsSchema.name.min(1)
    .allow('')
};

const addReviewSchema = {
  rate: joi.number()
    .required()
    .integer()
    .min(1)
    .max(5)
    .message('Rate must be a number between 1~5'),
  comment: joi.string()
    .trim()
    .allow('')
    .max(250)
    .message('Comment length cannot exceed 250 characters')
};

const getReviewsSchema = {
  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

const addOfferSchema = {
  title: joi.string()
    .required()
    .trim()
    .max(50)
    .min(2)
    .message('Title length cannot exceed 50 characters'),

  description: joi.string()
    .required()
    .trim()
    .max(250)
    .min(2)
    .message('Description length cannot exceed 250 characters'),

  price: joi.number()
    .required()
    .min(1)
    .message('Rate must be a number more than 1 L.E')
};

const getPlacesByAreaSchema = {
  area: joi.string().trim().required(),
  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

const getPlacesByCategoryAndArea = {
  category: joi.array().items(joi.string()),
  area: joi.array().items(joi.string()),
  placeName: joi.string().trim().allow('').required(),
  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

function getMenuItemValidation (type) {
  const menuItemSchema = {
    'History & Culture': {
      restrictions: joi.string().required().trim(),
      policies: joi.string().required().trim()
    },
    'Health & Fitness': {
      duration: joi.string().required().trim(),
      membershipType: joi.string().required().trim(),
      coach: joi.string().required().trim()
    },
    'Co-working Spaces': {
      roomType: joi.string().required().trim(),
      roomSize: joi.string().required().trim()
    },
    Entertainment: {
      name: joi.string().required().trim(),
      duration: joi.string().required().trim(),
      restrictions: joi.string().required().trim()
    },
    'Restaurants & Cafes': {
      name: joi.string().required().trim()
    }
  };

  const commonSchema = {
    category: joi.string().required().trim(),
    description: joi.string().required().trim(),
    price: joi.string().required().trim()
  };

  return joi.object({ ...commonSchema, ...menuItemSchema[type] });
}

function getMenuItemValidation2 (type) {
  const menuItemSchema = {
    history: {
      restrictions: joi.string().required().trim(),
      policies: joi.string().required().trim()
    },
    health: {
      duration: joi.string().required().trim(),
      membershipType: joi.string().required().trim(),
      coach: joi.string().required().trim()
    },
    'co-working spaces': {
      roomType: joi.string().required().trim(),
      roomSize: joi.string().required().trim()
    },
    entertainment: {
      name: joi.string().required().trim(),
      duration: joi.string().required().trim(),
      restrictions: joi.string().required().trim()
    },
    restaurants: {
      name: joi.string().required().trim()
    }
  };

  const commonSchema = {
    category: joi.string().required().trim(),
    description: joi.string().required().trim(),
    price: joi.string().required().trim()
  };

  return joi.array().min(1).items(joi.object({ ...commonSchema, ...menuItemSchema[type] }));
}

function getMenuItemValidationEdit (type) {
  const menuItemSchema = {
    history: {
      restrictions: joi.string().required().trim(),
      policies: joi.string().required().trim()
    },
    health: {
      duration: joi.string().required().trim(),
      membershipType: joi.string().required().trim(),
      coach: joi.string().required().trim()
    },
    'co-working spaces': {
      roomType: joi.string().required().trim(),
      roomSize: joi.string().required().trim()
    },
    entertainment: {
      name: joi.string().required().trim(),
      duration: joi.string().required().trim(),
      restrictions: joi.string().required().trim()
    },
    restaurants: {
      name: joi.string().required().trim()
    }
  };

  const commonSchema = {
    category: joi.string().required().trim(),
    description: joi.string().required().trim(),
    price: joi.string().required().trim()
  };

  return joi.object({ ...commonSchema, ...menuItemSchema[type] });
}

module.exports = {
  addPlace: joi.object({
    name: placeFieldsSchema.name.required(),
    description: placeFieldsSchema.description,
    owner: ownerSchema
  }),
  search: joi.object(searchSchema),
  getPlaces: joi.object(getPlacesSchema),
  addReview: joi.object(addReviewSchema),
  addBranches: joi.array().min(1).items(joi.object(branchSchema)),
  editBranch: joi.object(branchSchema),
  getReviews: joi.object(getReviewsSchema),
  paginationSchema: joi.object(paginationSchema),
  getPlacesByAreaSchema: joi.object(getPlacesByAreaSchema),
  getPlacesByCategoryAndArea: joi.object(getPlacesByCategoryAndArea),
  addOffer: joi.object(addOfferSchema),
  getMenuItemValidation,
  getMenuItemValidation2,
  getMenuItemValidationEdit

};