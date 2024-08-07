import express from "express";
import userController from "../controllers/userController.js";
import suEOControllre from "../controllers/suEOControllre.js";
import middleware from "../middleware/authMiddleware.js";
import  uploadFile  from "../middleware/uploadFile.js";

const router = express.Router();

// router.post('/upload',middleware.authMiddleware, uploadFile.handleFileUpload, uploadFile.uploadFile); // Comma added here
router.post('/entre', suEOControllre.incoming);
router.post('/going', suEOControllre.userOut);
router.get('/getentre', suEOControllre.getObjectives);
router.get('/getallObjective', middleware.authMiddleware, suEOControllre.getUserIcoming);
router.get('/allusers', middleware.authMiddleware, userController.getAllUsers);
router.get('/percent', middleware.authMiddleware, suEOControllre.getPercentageForDay);
router.get('/weekperc',middleware.authMiddleware,suEOControllre.getPercentageForWeek)
router.get('/monthperc',middleware.authMiddleware,suEOControllre.getPercentageForMonth)
router.get('/allreport', middleware.authMiddleware, suEOControllre.getAllreport);
router.post('/updateprofil', middleware.authMiddleware, userController.updateProfilePhotoURL);
router.get('/getprofil', middleware.authMiddleware, userController.getProfilePhotoURL);
// router.get('/getupload',middleware.authMiddleware, uploadFile.getProfilePhotoURL);

export default router;
