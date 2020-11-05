const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  findTechnologyById: {
    params: {
      technology_id: Joi.objectId().required(),
    },
  },
};
