import express from 'express'
import weeklyGoalController from '../controllers/weeklyGoalController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router()

router.post('/weekly',authMiddleware.authMiddleware,weeklyGoalController.createWeeklyGoal)
router.post('/weeks', authMiddleware.authMiddleware,weeklyGoalController.weekGoal)
router.get('/getgoal',authMiddleware.authMiddleware,weeklyGoalController.getDaysGoal)
router.get('/getweekly',authMiddleware.authMiddleware,weeklyGoalController.getWeeklyGoal)
export default router