import Goal from '../models/goalsModel.js'
import WeeklyGoal from '../models/weeklyGoalModel.js'
import User from '../models/userModel.js'

const createWeeklyGoal = async (req, res) => {
    const userId = req.user.id;
    try {
        // Vérifier si les données reçues dans req.body sont correctes
        const goalData = req.body;
        console.log('body', goalData);
        if (!goalData.weeklyGoal) {
            // Retourner une réponse d'erreur si des données essentielles sont manquantes
            return res.status(400).json({ message: "Weekly goal is required" });
        }

        // Créer un nouvel objectif hebdomadaire
        const newWeeklyGoal = new WeeklyGoal({
            weeklyGoal: goalData.weeklyGoal,
            postedBy: userId // Assign the userId to the postedBy field
        });

        // Enregistrer le nouvel objectif hebdomadaire dans la base de données
        await newWeeklyGoal.save();

        // Envoyer une réponse réussie avec l'objectif créé
        res.status(201).json({ message: "Weekly goal created successfully", data: newWeeklyGoal });
    } catch (error) {
        // Retourner une réponse d'erreur en cas d'erreur serveur
        console.error("Error creating weekly goal:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// creer les activites de la semaine 

const weekGoal = async (req, res) => {
    const userId = req.user.id;

    try {
        const goalData = req.body;
        console.log('data', goalData);
        if (!goalData) {
            return res.status(400).json({ message: "Weekly goal is required" });
        }

        // Extract individual fields from goalData
        const { tuesday, wednesday, thursday, friday, saturday } = goalData;

        // Create a new instance of the Goal model
        const newWeeklyGoal = new Goal({
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            postedBy: userId
        });

        // Save the new weekly goal to the database
        await newWeeklyGoal.save();

        // Send a success response with the created goal data
        res.status(201).json({ message: "Weekly goal created successfully", data: newWeeklyGoal });
    } catch (error) {
        console.error("Error creating weekly goal:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get activite definis pour semaine
const getDaysGoal = async (req, res) => {
    const userId = req.user.id;
    try {
        // Check if the user exists
        const existUser = await User.findById(userId);
        if (!existUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Find the most recent weekly goal for the user
        const weeklyGoal = await WeeklyGoal.findOne({ postedBy: userId }).sort({ createdAt: -1 });
        console.log("semai",weeklyGoal);
        // Check if a weekly goal exists for the user
        if (!weeklyGoal) {
            return res.status(404).json({ message: "Weekly goal not found" });
        }

        // Send the weekly goal data as a response
        res.status(200).json({ message: "Weekly goal found", data: weeklyGoal });
    } catch (error) {
        console.error("Error getting weekly goal:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 

const getWeeklyGoal = async (req, res) => {
    const userId = req.user.id;
    try {
        // Check if the user exists
        const existUser = await User.findById(userId);
        if (!existUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Find the most recent weekly goal for the user
        const weeklyGoal = await Goal.findOne({ postedBy: userId }).sort({ createdAt: -1 });
        
        

        // Check if a weekly goal exists for the user
        if (!weeklyGoal) {
            return res.status(404).json({ message: "Weekly goal not found" });
        }

        // Send the weekly goal data as a response
        res.status(200).json({ message: "Weekly goal found", data: weeklyGoal });
    } catch (error) {
        console.error("Error getting weekly goal:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export default { createWeeklyGoal,weekGoal,getWeeklyGoal,getDaysGoal };
