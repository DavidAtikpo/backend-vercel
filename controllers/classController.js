import Class from "../models/classModel.js";
import Children from "../models/childrenModel.js";
import Monitor from "../models/monitorModel.js";

export const createClass = async (req, res) => {
  try {
    const classe = await Class.create(req.body);
    const populatedClass = await Class.findById(classe._id)
      .populate('monitorId')
      .populate('childIds');
    res.status(201).json(populatedClass);
  } catch (err) {
    console.error('Erreur création classe:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate({
        path: 'monitorId',
        model: 'Monitor'
      })
      .populate({
        path: 'childIds',
        model: 'Children'
      });
    res.json(classes);
  } catch (err) {
    console.error('Erreur récupération classes:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const classe = await Class.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('monitorId').populate('childIds');
    res.json(classe);
  } catch (err) {
    console.error('Erreur mise à jour classe:', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted" });
  } catch (err) {
    console.error('Erreur suppression classe:', err);
    res.status(400).json({ error: err.message });
  }
};