const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    name: { type: String },
    foundationDate: { type: Date },
    image: { type: String },
    web: { type: String },
  },
  {
    collection: 'companies',
  },
);

module.exports = mongoose.models.Company || mongoose.model('Company', schema);
