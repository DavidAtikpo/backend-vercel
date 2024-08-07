import express from 'express'
import absentController from '../controllers/absentController.js'

const router = express.Router()
router.post('/present',absentController.AbsentChild)
router.get('/absent',absentController.absentChildren)

export default router