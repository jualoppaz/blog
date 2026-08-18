const Joi = require('joi');

module.exports = {
  findAllKnowledge: {
    query: Joi.object({
      type: Joi.string(),
    }),
  },
};
