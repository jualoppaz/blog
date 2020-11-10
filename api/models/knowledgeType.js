const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    name: { type: String },
  },
  {
    collection: 'knowledge_types',
  },
);

module.exports = mongoose.models.KnowledgeType || mongoose.model('KnowledgeType', schema);
