import Class from "../models/classModel.js";

export const createClass = async (req, res) => {
  try {
    const classe = await Class.create(req.body);
    res.status(201).json(classe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("monitorId").populate("childIds");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const classe = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(classe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 