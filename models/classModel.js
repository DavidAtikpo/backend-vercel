import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monitor',
    required: true
  },
  childIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Children'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt avant chaque save
classSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Class = mongoose.model('Class', classSchema);

export default Class; 