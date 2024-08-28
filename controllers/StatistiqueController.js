import { DailyStats, WeeklyStats, MonthlyStats, YearlyStats } from '../models/Statistics.js';

import Out from '../models/userReport.js'; // Votre modèle `UserReport`

export const calculateDailyStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }); // Obtient le jour de la semaine en anglais (par exemple, 'Monday')

  try {
    const reports = await Out.find({ createdAt: { $gte: today } });

    if (reports.length > 0) {
      const totalPercentage = reports.reduce((total, report) => total + report.pourcentage, 0);
      const averagePercentage = totalPercentage / reports.length;

      console.log('Average Percentage for today:', averagePercentage);

      await DailyStats.findOneAndUpdate(
        { date: today }, // Find the document with today's date
        { 
          averagePercentage, // Update the average percentage
          dayOfWeek // Include the day of the week
        },
        { upsert: true, new: true, setDefaultsOnInsert: true } // Create a new document if one doesn't exist
      );
      
      console.log('Daily statistics saved or updated successfully.');
    } else {
      console.log('No reports found for today.');
    }
  } catch (error) {
    console.error('Error calculating daily statistics:', error);
  }
};



// import WeeklyStats from '../models/Statistics.js';

// get week statistics
export const calculateWeeklyStats = async () => {
  const today = new Date();
  
  // Calcul du début de la semaine
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  weekStart.setHours(0, 0, 0, 0);

  // Calcul du numéro de la semaine
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

  try {
    const reports = await Out.find({ createdAt: { $gte: weekStart } });

    if (reports.length > 0) {
      const totalPercentage = reports.reduce((total, report) => total + report.pourcentage, 0);
      const averagePercentage = totalPercentage / reports.length;

      await WeeklyStats.findOneAndUpdate(
        { weekStart },
        { weekNumber, averagePercentage }, // Inclure le numéro de la semaine
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log('Weekly statistics saved or updated successfully.');
    } else {
      console.log('No reports found for this week.');
    }
  } catch (error) {
    console.error('Error calculating weekly statistics:', error);
  }
};


// Calcul et enregistrement des statistiques annuelles
export const calculateYearlyStats = async () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1); // Début de l'année
  startOfYear.setHours(0, 0, 0, 0);

  try {
    const reports = await Out.find({ createdAt: { $gte: startOfYear } });

    if (reports.length > 0) {
      const totalPercentage = reports.reduce((total, report) => total + report.pourcentage, 0);
      const averagePercentage = totalPercentage / reports.length;

      await YearlyStats.findOneAndUpdate(
        { year: today.getFullYear() }, 
        { averagePercentage },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log('Statistiques annuelles sauvegardées ou mises à jour avec succès.');
    } else {
      console.log('Aucun rapport trouvé pour cette année.');
    }
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques annuelles :', error);
  }
};


export const getDailyStats = async (req, res) => {
  try {
    const dailyStats = await DailyStats.find({});
    // Map to include dayOfWeek in response
    const formattedStats = dailyStats.map(stat => ({
      day: stat.dayOfWeek,
      averagePercentage: stat.averagePercentage
    }));

    console.log("Statistiques du jour", formattedStats);
    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily statistics", error });
  }
};

// get Month statistics

export const calculateMonthlyStats = async () => {
  const today = new Date();
  const month = new Date(today.getFullYear(), today.getMonth(), 1);
  month.setHours(0, 0, 0, 0);

  // Récupération du nom du mois
  const monthName = month.toLocaleString('default', { month: 'long' });

  try {
    const reports = await Out.find({ createdAt: { $gte: month } });

    if (reports.length > 0) {
      const totalPercentage = reports.reduce((total, report) => total + report.pourcentage, 0);
      const averagePercentage = totalPercentage / reports.length;

      await MonthlyStats.findOneAndUpdate(
        { month },
        { monthName, averagePercentage }, // Inclure le nom du mois
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log('Monthly statistics saved or updated successfully.');
    } else {
      console.log('No reports found for the month.');
    }
  } catch (error) {
    console.error('Error calculating monthly statistics:', error);
  }
};

// get Years statistics
// Récupérer les statistiques hebdomadaires avec le numéro de semaine
export const getWeeklyStats = async (req, res) => {
  try {
    const weeklyStats = await WeeklyStats.find();
    res.status(200).json(weeklyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weekly statistics", error });
  }
};

// Récupérer les statistiques mensuelles avec le nom du mois
export const getMonthlyStats = async (req, res) => {
  try {
    const monthlyStats = await MonthlyStats.find();
    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly statistics", error });
  }
};

// Récupérer les statistiques annuelles
export const getYearlyStats = async (req, res) => {
  try {
    const yearlyStats = await YearlyStats.find();
    res.status(200).json(yearlyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching yearly statistics", error });
  }
};



// Repeat similarly for getWeeklyStats, getMonthlyStats, and getYearlyStats

