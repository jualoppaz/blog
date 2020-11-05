const mongoose = require('mongoose');

const { Schema } = mongoose;

const professionalProjectSchema = new Schema({
  name: { type: String },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  position: { type: String },
  technologies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Technology',
    },
  ],
  functions: [
    {
      text: { type: String },
    },
  ],
});

const clientSchema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
  projects: [professionalProjectSchema],
});

const schema = new Schema(
  {
    description: { type: String },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    projects: [professionalProjectSchema],
    clients: [clientSchema],
  },
  {
    collection: 'professional_experiences',
  },
);

module.exports = mongoose.models.ProfessionalExperience || mongoose.model('ProfessionalExperience', schema);
