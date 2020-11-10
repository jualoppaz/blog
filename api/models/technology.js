const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    name: { type: String },
    image: { type: String },
    web: { type: String },
  },
  {
    collection: 'technologies',
  },
);

module.exports = mongoose.models.Technology || mongoose.model('Technology', schema);
