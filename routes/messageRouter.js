import express from 'express'
import messageController from '../controllers/messageController.js'
const router = express.Router()

router.post('/createMessage',messageController.createMessage)
router.get('/getMessage',messageController.getMessageById)
router.get('/geAlltMessage',messageController.getMessagesBetweenUsers)
router.put('/updateMessage',messageController.updateMessage)
router.delete('/:id',messageController.deleteMessage)


export default router