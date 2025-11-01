const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  originalName: String,
  fileName: String,
  mimeType: String,
  size: Number,
  path: String
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  schemeId: { type: String, required: true },
  schemeName: { type: String },
  fullName: { type: String, required: true },
  applicantEmail: { type: String },
  phoneNumber: { type: String, required: true },
  address: { type: String },
  landArea: { type: Number },
  aadharNumber: { type: String },
  bankAccountNumber: { type: String },
  ifscCode: { type: String },
  documents: [documentSchema],
  status: { type: String, default: 'Submitted' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
