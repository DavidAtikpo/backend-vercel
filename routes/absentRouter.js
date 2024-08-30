import express from 'express'
import absentController from '../controllers/absentController.js'

const router = express.Router()
router.delete('/absentchild/:id', absentController.deleteAbsentCountAndDates);
router.post('/present',absentController.AbsentChild)
router.get('/absent',absentController.absentChildren)
// router.delete('/absent/:id/absentCountAndDates',absentController.deleteAbsentCountAndDates)
// Route pour supprimer absentCount et absentDates


export default router