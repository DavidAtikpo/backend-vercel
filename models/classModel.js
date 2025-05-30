import mongoose from "mongoose";
const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  monitorId: { type: mongoose.Schema.Types.ObjectId, ref: "Monitor", required: true },
  childIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }]
});
export default mongoose.model("Class", classSchema); 