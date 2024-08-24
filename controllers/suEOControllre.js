import Enter from "../models/suEnModel.js";
import Out from "../models/userReport.js";
import User from "../models/userModel.js";
import validateMongoDbId from "../utils/validateMongodbid.js";


// Importez les fonctions depuis le fichier StatistiqueController.js
import { calculateDailyStats, calculateWeeklyStats, calculateMonthlyStats, calculateYearlyStats } from './StatistiqueController.js';

// Votre code dans suEOControllre.js ou suEOController.js
const userOut = async (req, res) => {
  const userId = req.user;
  try {
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const fieldBody = {
      ...req.body,
      postedBy: findUser._id,
    };

    const createReport = await Out.create(fieldBody);

    // Appel des fonctions de calcul des statistiques
    await calculateDailyStats();
    await calculateWeeklyStats();
    await calculateMonthlyStats();
    await calculateYearlyStats();

    return res.status(201).json(createReport);

  } catch (error) {
    console.error('Error saving user report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// User will create the time he comes to service for the objective of the day
const incoming = async (req, res) => {
  const user = req.user; // Assuming the user object is available in the request

  try {
    if (!user) {
      return res.status(401).json({ message: "Please log in before filling this form" });
    }

    const fieldBody = {
      ...req.body,
      postedBy: user._id,  // Save the user's ID as a reference in the "Enter" model
      //firstName: user.firstName 
    };

    const newEntry = await Enter.create(fieldBody);
    res.json({ entry: newEntry, user: user.firstName, });
  } catch (error) {
    console.error("Error creating new entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//Admin will get all the user report 

  const getAllreport = async(req,res)=>{
    const user = req.user
    try {
      const isAdmin = user.role === 'Coordinateur';
      if (!isAdmin) {
        return res.status(403).json('Please contact admin.');
      }
   // Récupérer toutes les entrées du modèle Enter
   const entries = await Out.find();

   // Pour chaque entrée, récupérer les informations de l'utilisateur associé
   // et ajouter le rôle de l'utilisateur à l'objet d'entrée
   const entriesWithUserRole = await Promise.all(entries.map(async (entry) => {
     const user = await User.findById(entry.postedBy); // Supposons que userId est le champ qui contient l'ID de l'utilisateur
     if (user) {
       return {
         ...entry.toObject(),
         role: user.role ,// Ajouter le rôle de l'utilisateur à l'objet d'entrée
         profilePhotoURL: user.profilePhotoURL
       };
     } else {
       return entry.toObject();
     }
   }));

   res.json(entriesWithUserRole);
 } catch (error) {
   console.error('Error occurred while fetching user entries:', error);
   res.status(500).json({ error: 'Internal server error' });

  }
}

//get all the percentage the user

const getPercentageForDay = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day
    const dayData = await Out.find({ createdAt: { $gte: today } });
    const totalPercentage = dayData.reduce((total, item) => total + item.pourcentage, 0);
    const averagePercentage = dayData.length > 0 ? totalPercentage / dayData.length : 0;
    res.json(averagePercentage);
  } catch (error) {
    console.error('Error fetching percentage for the day:', error);
    res.status(500).json('Internal server error');
  }
};


const getPercentageForWeek = async (req, res) => {
  try {
    const today = new Date();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay()); // Set date to start of the current week (Sunday)
    startOfCurrentWeek.setHours(0, 0, 0, 0);
    
    const startOfPreviousWeek = new Date(startOfCurrentWeek);
    startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7); // Set date to start of the previous week
    
    // Get data for today (Monday)
    const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0); // Set date to start of today
const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999); // Set date to end of today
const todayData = await Out.find({ 
  createdAt: { 
    $gte: startOfToday, // Include data from the start of today
    $lte: endOfToday // Include data until the end of today
  } 
});

    console.log('today',todayData);
    // Get data for the previous week
    const weekData = await Out.find({ 
      createdAt: { 
        $gte: startOfPreviousWeek, // Include data from the start of previous week
        $lt: startOfCurrentWeek // Exclude data from the start of current week
      } 
    });
    // console.log('weekdata',weekData);
    const totalPercentageOfDay= todayData.reduce((total, item)=> total + item.pourcentage,0);
    const totalPercentage = weekData.reduce((total, item) => total + item.pourcentage, 0);
    const todayPercentage = todayData.length > 0 ? totalPercentageOfDay / todayData.length : 0;
    const averagePercentage = weekData.length > 0 ? totalPercentage / weekData.length : 0;
    res.json({ todayPercentage, averagePercentage });
  } catch (error) {
    console.error('Error fetching percentage for the week:', error);
    res.status(500).json('Internal server error');
  }
};




const getPercentageForMonth = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthData = await Out.find({ createdAt: { $gte: startOfMonth } });
    const totalPercentage = monthData.reduce((total, item) => total + item.pourcentage, 0);
    const averagePercentage = monthData.length > 0 ? totalPercentage / monthData.length : 0;
    res.json(averagePercentage);
  } catch (error) {
    console.error('Error fetching percentage for the month:', error);
    res.status(500).json('Internal server error');
  }
};



// the user will get recently objective he posted 
const getObjectives = async (req, res) => {
  const user = req.user;
  try {
      // Fetch the most recent report from the Enter model
      const enterReport = Enter.findOne({ postedBy: user }).sort({ createdAt: -1 });

      // Fetch the most recent report from the Out model
      const outReport = Out.findOne({ postedBy: user }).sort({ createdAt: -1 });

      // Wait for both promises to resolve
      const [enterObjective, outObjective] = await Promise.all([enterReport, outReport]);

      // Return the results
      res.json({ enterObjective, outObjective });
  } catch (error) {
      console.error('Error occurred while fetching recent reports:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

  
// admin will get all the incoming and out for all the user was posted
const getUserIcoming = async (req, res) => {
  const user = req.user;
  try {
    const isAdmin = user.role === 'Coordinateur';
    if (!isAdmin) {
      return res.status(403).json('Please, you are not an admin.');
    }

    // Récupérer toutes les entrées du modèle Enter
    const entries = await Enter.find();

    // Pour chaque entrée, récupérer les informations de l'utilisateur associé
    // et ajouter le rôle de l'utilisateur à l'objet d'entrée
    const entriesWithUserRole = await Promise.all(entries.map(async (entry) => {
      const user = await User.findById(entry.postedBy); // Supposons que userId est le champ qui contient l'ID de l'utilisateur
      if (user) {
        return {
          ...entry.toObject(),
          role: user.role // Ajouter le rôle de l'utilisateur à l'objet d'entrée
        };
      } else {
        return entry.toObject();
      }
    }));

    res.json(entriesWithUserRole);
  } catch (error) {
    console.error('Error occurred while fetching user entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {incoming,userOut,getObjectives,getUserIcoming,getAllreport,getPercentageForDay,getPercentageForWeek,getPercentageForMonth}