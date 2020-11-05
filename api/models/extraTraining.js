const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    image: { type: String },
    date: { type: Date },
    description: { type: String },
  },
  {
    collection: 'extra_training',
  },
);

module.exports = mongoose.models.ExtraTraining || mongoose.model('ExtraTraining', schema);
