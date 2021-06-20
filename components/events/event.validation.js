const joi = require('@hapi/joi');

const paginationSchema = {
  pageNo: joi
    .string()
    .required()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number'),
  limitNo: joi
    .string()
    .required()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number')
};

const addEventSchema = {
  title: joi
    .string()
    .required()
    .trim()
    .lowercase()
    .ruleset.min(2)
    .max(40)
    .rule({
      message:
        'Length must be between 2~40 characters and consists of letters only'
    }),

  address: joi.string().trim().lowercase(),

  type: joi.string().required().trim().lowercase(),

  description: joi.string().required().trim().max(400),
  date: joi.date().required(),
  startTime: joi.number().required().ruleset.min(0).max(24).rule({
    message: 'time must be numbers only and less than 24 and more than 0'
  }),
  endTime: joi.number().required().ruleset.min(0).max(24).rule({
    message: 'time must be numbers only and less than 24 and more than 0'
  }),
  branchId: joi.string(),

  price: joi
    .number()
    .required()
    .ruleset.min(1)
    .rule({ message: 'Price must be only numbers and minimum 1' }),

  floor: joi.string().trim().lowercase(),

  area: joi.string().trim().lowercase(),

  city: joi.string().trim().lowercase(),

  street: joi.string().trim().lowercase(),

  building: joi.string().trim().lowercase()
};

const eventSchema = {
  title: joi.string().trim().lowercase(),

  address: joi.string().trim().lowercase(),

  type: joi.string().trim().lowercase(),

  description: joi.string().trim().lowercase(),

  date: joi.date().required(),
  startTime: joi.number(),
  endTime: joi.number(),
  latitude: joi.number(),
  longitude: joi.number(),

  price: joi.number(),

  floor: joi.string().trim().lowercase(),

  area: joi.string().trim().lowercase(),

  city: joi.string().trim().lowercase(),

  street: joi.string().trim().lowercase(),

  building: joi.string().trim().lowercase(),
  branchId: joi.string()
};

const eventTypeSchema = {
  type: joi.string().trim().lowercase(),

  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

const eventInDateSchema = {
  inDate: joi.date().required()
};

const eventTypeAndDate = {
  type: joi.string().trim().lowercase().allow(''),
  // type: joi.array().items(joi.string()),

  inDate: joi.date(),
  endDate: joi.date(),

  address: joi.string().trim().lowercase().allow(''),

  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

const eventTypeAndDate2 = {
  title: joi.string().trim().lowercase().allow(''),
  type: joi.array().items(joi.string()),

  fromDate: joi.date(),
  toDate: joi.date(),

  location: joi.array().items(joi.string()),

  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

const pagination = {
  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

const betweenDatesSchema = {
  startDate: joi.date().required(),
  endDate: joi.date().required()
};

module.exports = {
  addEvent: joi.object(addEventSchema),
  newEvent: joi.object(eventSchema),
  eventType: joi.object(eventTypeSchema),
  inDate: joi.object(eventInDateSchema),
  betweenDates: joi.object(betweenDatesSchema),
  eventDateAndType: joi.object(eventTypeAndDate),
  eventDateAndType2: joi.object(eventTypeAndDate2),
  paginationSchema: joi.object(pagination)
};