import express from 'express'
import childrenController from '../controllers/childrenController.js'
import authMiddleware from '../middleware/authMiddleware.js'
const router = express.Router()

router.put('/update/:id',authMiddleware.authMiddleware, childrenController.updateChild)
router.post('/childInfo',authMiddleware.authMiddleware, childrenController.createChildren)
router.get('/allchildren',authMiddleware.authMiddleware, childrenController.getAllChildren)
router.get('/getprofilepicture/:id',childrenController.getProfilePhotoURL)


export default router