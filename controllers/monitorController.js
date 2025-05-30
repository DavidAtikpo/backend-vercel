import Monitor from "../models/monitorModel.js";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

export const createMonitor = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    // Vérifier si l'email existe déjà
    const existingMonitor = await userModel.findOne({ email });
    if (existingMonitor) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le moniteur avec le mot de passe hashé
    const monitor = await userModel.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role || 'monitor' // Utiliser le rôle fourni ou 'monitor' par défaut
    });

    // Ne pas renvoyer le mot de passe hashé dans la réponse
    const monitorResponse = monitor.toObject();
    delete monitorResponse.password;

    res.status(201).json(monitorResponse);
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