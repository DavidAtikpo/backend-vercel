import MonitorReport from "../models/monitorReportModel.js";

export const createMonitorReport = async (req, res) => {
  try {
    const report = await MonitorReport.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMonitorReports = async (req, res) => {
  try {
    const reports = await MonitorReport.find()
      .populate("classId")
      .populate("monitorId");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMonitorReport = async (req, res) => {
  try {
    const report = await MonitorReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMonitorReport = async (req, res) => {
  try {
    await MonitorReport.findByIdAndDelete(req.params.id);
    res.json({ message: "Monitor report deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 