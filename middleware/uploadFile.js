// const handleFileUpload = upload.single('profileImage'); 


// import multer from 'multer';
// import path from 'path';
// import Upload from '../models/uploadModel.js';

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Define the destination directory for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Nom de fichier unique
//   },
// });

// const upload = multer({ storage });

// // Function to handle file upload
// export const uploadFile = async (req, res) => {
//   try {
//     // Extract metadata from the request or file object
//     const userId = req.user._id; // Assuming req.user is populated correctly by your authentication middleware
//     const { filename } = req.file;

//     // Save only the path to the database
//     const path = `/uploads/${filename}`; // Assuming uploads are served from a /uploads directory
//     const metadata = new Upload({
//       path,
//       postedBy: userId,
//     });
//     await metadata.save();

//     res.status(200).json({ message: 'File uploaded successfully.' });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ error: 'Failed to upload file.' });
//   }
// };

// // Multer middleware for handling file 

// // Multer middleware for handling file uploads
//  const handleFileUpload = upload.single('profileImage'); // Use 'profileImage' as the field name



// // Other routes and middleware...



// // get path for image

// const getProfilePhotoURL = async (req, res) => {
//   const userId = req.user; // Récupère l'ID de l'utilisateur depuis la requête
//   try {
//     // Recherche dans la base de données l'image de profil associée à l'utilisateur
//     const userProfile = await Upload.findOne({ postedBy:userId.id });
//     if (!userProfile) {
//       // Si aucun profil n'est trouvé, renvoie un message indiquant qu'aucune URL d'image de profil n'a été enregistrée
//       res.json({ error: 'No profile photo URL saved' });
//     } else {
//       // Si un profil est trouvé, renvoie les détails du profil contenant l'URL de l'image de profil
//       res.json(userProfile.path);
//     }
//   } catch (error) {
//     // Gestion des erreurs
//     console.error('Error retrieving profile photo URL:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// export default{handleFileUpload, uploadFile,getProfilePhotoURL};


// Importer les modules nécessaires
import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/userModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

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
router.post('/upload',authMiddleware.authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    // Enregistrer l'URL de l'image dans la base de données MongoDB
    const profilePhotoURL = '/uploads/' + req.file.filename;
    const userId = req.user._id; // Récupérer l'ID de l'utilisateur à partir de la demande
    await User.findByIdAndUpdate(userId, { profilePhotoURL });

    // Envoyer l'URL de l'image de profil en réponse
    res.json({ path: profilePhotoURL });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload profile image.' });
  }
});

// Exporter le routeur
export default router;

