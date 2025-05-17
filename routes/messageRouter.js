import express from 'express'
import messageController from '../controllers/messageController.js'
const router = express.Router()

// Route pour créer un message
router.post('/message', messageController.createMessage)

// Route pour obtenir les messages entre deux utilisateurs
router.get('/messages/:receiverId', messageController.getMessagesBetweenUsers)

// Route pour obtenir un message spécifique
router.get('/message/:id', messageController.getMessageById)

// Route pour mettre à jour un message
router.put('/message/:id', messageController.updateMessage)

// Route pour supprimer un message
router.delete('/message/:id', messageController.deleteMessage)

export default router