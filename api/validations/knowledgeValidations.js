const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  findAllKnowledge: {
    query: {
      type: Joi.string(),
    },
  },
};
