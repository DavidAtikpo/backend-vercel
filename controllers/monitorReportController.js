import MonitorReport from "../models/monitorReportModel.js";
import Class from "../models/classModel.js";

export const createMonitorReport = async (req, res) => {
  try {
    // Vérifier si la classe existe
    const classe = await Class.findById(req.body.classId);
    if (!classe) {
      return res.status(404).json({ error: "Classe non trouvée" });
    }

    // Ajouter l'ID du moniteur depuis la classe
    const reportData = {
      ...req.body,
      monitorId: classe.monitorId
    };

    const report = await MonitorReport.create(reportData);
    const populatedReport = await MonitorReport.findById(report._id)
      .populate("classId")
      .populate("monitorId");
    
    res.status(201).json(populatedReport);
  } catch (err) {
    console.error('Erreur création rapport:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getMonitorReports = async (req, res) => {
  try {
    const reports = await MonitorReport.find()
      .populate({
        path: "classId",
        select: "name"
      })
      .populate({
        path: "monitorId",
        select: "firstName lastName"
      })
      .sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Erreur récupération rapports:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getMonitorReportsByClass = async (req, res) => {
  try {
    const reports = await MonitorReport.find({ classId: req.params.classId })
      .populate({
        path: "classId",
        select: "name"
      })
      .populate({
        path: "monitorId",
        select: "firstName lastName"
      })
      .sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Erreur récupération rapports par classe:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getMonitorReportsByMonitor = async (req, res) => {
  try {
    const reports = await MonitorReport.find({ monitorId: req.params.monitorId })
      .populate({
        path: "classId",
        select: "name"
      })
      .populate({
        path: "monitorId",
        select: "firstName lastName"
      })
      .sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Erreur récupération rapports par moniteur:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateMonitorReport = async (req, res) => {
  try {
    const report = await MonitorReport.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate("classId").populate("monitorId");
    
    if (!report) {
      return res.status(404).json({ error: "Rapport non trouvé" });
    }
    
    res.json(report);
  } catch (err) {
    console.error('Erreur mise à jour rapport:', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteMonitorReport = async (req, res) => {
  try {
    const report = await MonitorReport.findByIdAndDelete(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: "Rapport non trouvé" });
    }
    
    res.json({ message: "Rapport supprimé avec succès" });
  } catch (err) {
    console.error('Erreur suppression rapport:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getRecentMonitorReports = async (req, res) => {
  try {
    const reports = await MonitorReport.find()
      .populate({
        path: "classId",
        select: "name"
      })
      .populate({
        path: "monitorId",
        select: "firstName lastName"
      })
      .sort({ date: -1 })
      .limit(5); // Limite à 5 rapports les plus récents
    
    res.json(reports);
  } catch (err) {
    console.error('Erreur récupération rapports récents:', err);
    res.status(500).json({ error: err.message });
  }
}; 