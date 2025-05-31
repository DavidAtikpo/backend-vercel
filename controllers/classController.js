import Class from "../models/classModel.js";
import Children from "../models/childrenModel.js";

export const createClass = async (req, res) => {
  try {
    const classe = await Class.create(req.body);
    const populatedClass = await Class.findById(classe._id)
      .populate({
        path: 'monitorId',
        select: 'firstName lastName email phoneNumber'
      })
      .populate({
        path: 'childIds',
        model: 'Children'
      });
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
        select: 'firstName lastName email phoneNumber'
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

export const getMonitorClass = async (req, res) => {
  try {
    const monitorId = req.user._id;
    console.log('ID du moniteur:', monitorId);
    
    if (!monitorId) {
      return res.status(400).json({ error: "ID du moniteur manquant" });
    }
    
    const classe = await Class.findOne({ monitorId });
    console.log('Résultat de la recherche:', classe);
    
    if (!classe) {
      console.log('Aucune classe trouvée pour le moniteur');
      return res.status(404).json({ error: "Aucune classe trouvée pour ce moniteur" });
    }

    const populatedClass = await Class.findOne({ monitorId })
      .populate({
        path: 'monitorId',
        select: 'firstName lastName email phoneNumber'
      })
      .populate({
        path: 'childIds',
        model: 'Children'
      });
    
    console.log('Classe avec données populées:', populatedClass);
    res.json(populatedClass);
  } catch (err) {
    console.error('Erreur récupération classe moniteur:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const classe = await Class.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    )
    .populate({
      path: 'monitorId',
      select: 'firstName lastName email phoneNumber'
    })
    .populate({
      path: 'childIds',
      model: 'Children'
    });
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