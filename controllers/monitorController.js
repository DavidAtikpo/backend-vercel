import Monitor from "../models/monitorModel.js";

export const createMonitor = async (req, res) => {
  try {
    console.log('request.body', req.body)
    const monitor = await Monitor.create(req.body);
    res.status(201).json(monitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find();
    res.json(monitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(monitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMonitor = async (req, res) => {
  try {
    await Monitor.findByIdAndDelete(req.params.id);
    res.json({ message: "Monitor deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 