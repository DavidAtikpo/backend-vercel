import mongoose from "mongoose";
const monitorReportSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  monitorId: { type: mongoose.Schema.Types.ObjectId, ref: "Monitor", required: true },
  date: { type: String, required: true },
  title: String,
  subTheme: String,
  need: String,
  presences: { type: Object, default: {} }, // { childId: true/false }
  behaviors: { type: Object, default: {} }  // { childId: 'Bien'/'Moyen'/'Difficile' }
});
export default mongoose.model("MonitorReport", monitorReportSchema); 