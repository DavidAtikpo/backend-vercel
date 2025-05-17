import express from 'express'
import messageController from '../controllers/messageController.js'
import authMiddleware from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/createMessage',authMiddleware.authMiddleware,messageController.createMessage)
router.get('/getMessage',authMiddleware.authMiddleware,messageController.getMessageById)
router.get('/geAlltMessage',authMiddleware.authMiddleware,messageController.getMessagesBetweenUsers)
router.put('/updateMessage',authMiddleware.authMiddleware,messageController.updateMessage)
router.delete('/:id',authMiddleware.authMiddleware,messageController.deleteMessage)


export default router