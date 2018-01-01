'use strict';

const mongoose = require('hexin-core/helpers/Database').getConnection();

const {Schema} = mongoose;
const SchemaTypes = Schema.Types;

const iamSchema = new Schema({
  type: {type: String, required: true},
  subType: {type: String},
  description: {type: String, required: true},
  credentials: SchemaTypes.Mixed,
  params: SchemaTypes.Mixed,
  isActive: {type: Boolean, required: true}
}, {collection: 'iams'});

module.exports = mongoose.model('Iam', iamSchema);
