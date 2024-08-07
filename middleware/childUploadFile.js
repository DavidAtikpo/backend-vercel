// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import Children from '../models/childrenModel.js';

// // Configuration du stockage pour multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Dossier de destination pour les fichiers téléchargés
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Nom de fichier unique
//   }
// });

// // Initialiser multer avec la configuration de stockage
// const upload = multer({ storage });

// // Créer une instance du routeur Express
// const router = express.Router();

// // Route pour télécharger l'image de profil et enregistrer d'autres données
// router.post('/uploadChild/:id', upload.single('profileImage'), async (req, res) => {
//   try {
//     // Extraire les autres données de l'enfant de la requête
//     const { firstName, lastName, birthDate, birthPlace, sex, class: childClass, school, live, fatherName, motherName, phoneNumber, occupation, otherInfo } = req.body;

//     // Enregistrer l'URL de l'image dans la base de données MongoDB
//     const profilePhotoURL = '/uploads/' + req.file.filename;
//     const _id = req.params.id; // Récupérer l'ID de l'enfant à partir de la demande
//     await Children.findByIdAndUpdate(_id, { 
//       firstName,
//       lastName,
//       birthDate,
//       birthPlace,
//       sex,
//       class: childClass,
//       school,
//       live,
//       fatherName,
//       motherName,
//       phoneNumber,
//       occupation,
//       otherInfo,
//       profilePhotoURL 
//     });
// console.log('req.body',req.body);
//     // Envoyer l'URL de l'image de profil en réponse
//     res.json({ path: profilePhotoURL });
//   } catch (error) {
//     console.error('Error uploading profile image:', error);
//     res.status(500).json({ error: 'Failed to upload profile image.' });
//   }
// });

// // Exporter le routeur
// export default router;


import express from 'express';
import multer from 'multer';
import path from 'path';
import Children from '../models/childrenModel.js'

// Configuration du stockage pour multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier de destination pour les fichiers téléchargés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom de fichier unique
  }
});

// Initialiser multer avec la configuration de stockage
const upload = multer({ storage });

// Créer une instance du routeur Express
const router = express.Router();

// Route pour télécharger l'image de profil
router.post('/uploadChild/:id',upload.single('profileImage'), async (req, res) => {
  try {
    // Enregistrer l'URL de l'image dans la base de données MongoDB
    const profilePhotoURL = '/uploads/' + req.file.filename;
    const _id = req.params.id; // Récupérer l'ID de l'utilisateur à partir de la demande
    await Children.findByIdAndUpdate(_id, { profilePhotoURL });

    // Envoyer l'URL de l'image de profil en réponse
    res.json({ path: profilePhotoURL });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload profile image.' });
  }
});

// Exporter le routeur
export default router;