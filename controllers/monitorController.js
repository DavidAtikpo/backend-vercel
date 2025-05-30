import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

export const createMonitor = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;

    // Vérifier si l'email existe déjà
    const existingMonitor = await userModel.findOne({ email });
    if (existingMonitor) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Créer le moniteur (le mot de passe sera hashé automatiquement par le middleware pre("save"))
    const monitor = await userModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password, // Envoyer le mot de passe en clair, il sera hashé par le middleware
      role: 'monitor'
    });

    // Ne pas renvoyer le mot de passe hashé dans la réponse
    const monitorResponse = monitor.toObject();
    delete monitorResponse.password;

    res.status(201).json({
      message: `${monitor.firstName} created successfully`,
      monitor: monitorResponse
    });
  } catch (err) {
    console.error('Erreur création moniteur:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getMonitors = async (req, res) => {
  try {
    const monitors = await userModel.find({role: 'monitor'});
    res.json(monitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMonitor = async (req, res) => {
  try {
    const monitor = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(monitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMonitor = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Monitor deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 