
import mongoose from "mongoose";

// Define the schema for the uploaded files
const uploadSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a model based on the schema
export default mongoose.model('Upload', uploadSchema);


