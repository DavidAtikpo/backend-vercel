import { DailyStats, WeeklyStats, MonthlyStats, YearlyStats } from '../models/Statistics.js';

import Out from '../models/userReport.js'; // Votre modèle `UserReport`

export const calculateDailyStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const reports = await Out.find({ createdAt: { $gte: today } });

    if (reports.length > 0) {
      const totalPercentage = reports.reduce((total, report) => total + report.pourcentage, 0);
      const averagePercentage = totalPercentage / reports.length;

      console.log('Average Percentage for today:', averagePercentage);

      await DailyStats.findOneAndUpdate(
        { date: today }, // Find the document with today's date
        { averagePercentage }, // Update the average percentage
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

export const calculateWeeklyStats = async () => {
  const today = new Date();

  // Get the start of the current week (assuming Monday as the start of the week)
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1));  // Set to Monday
  weekStart.setHours(0, 0, 0, 0);  // Reset time to midnight

  try {
    const reports = await Out.find({ createdAt: { $gte: weekStart } });

    if (reports.length > 0) {
      const totalPercentage = reports.reduce((total, report) => total + report.pourcentage, 0);
      const averagePercentage = totalPercentage / reports.length;

      // Use findOneAndUpdate to avoid duplicate key errors
      await WeeklyStats.findOneAndUpdate(
        { weekStart },  // Find by the start of the week
        { averagePercentage },  // Update the average percentage
        { upsert: true, new: true, setDefaultsOnInsert: true }  // Create if not exist
      );

      console.log('Weekly statistics saved or updated successfully.');
    } else {
      console.log('No reports found for this week.');
    }
  } catch (error) {
    console.error('Error calculating weekly statistics:', error);
  }
};



// import MonthlyStats from '../models/Statistics.js';

export const calculateMonthlyStats = async () => {
  const today = new Date();
  const month = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
  month.setHours(0, 0, 0, 0);

  try {
    const reports = await Out.find({ createdAt: { $gte: month } });

    if (reports.length > 0) {
      const totalPercentage = reports.reduce((total, report) => total + report.pourcentage, 0);
      const averagePercentage = totalPercentage / reports.length;

      console.log('Average Percentage for the month:', averagePercentage);

      await MonthlyStats.findOneAndUpdate(
        { month }, // Find the document for the current month
        { averagePercentage }, // Update the average percentage
        { upsert: true, new: true, setDefaultsOnInsert: true } // Create if not exist
      );
      
      console.log('Monthly statistics saved or updated successfully.');
    } else {
      console.log('No reports found for the month.');
    }
  } catch (error) {
    console.error('Error calculating monthly statistics:', error);
  }
};



// Calcul et enregistrement des statistiques annuelles
export const calculateYearlyStats = async () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);  // Start of the year

  try {
    const reports = await Out.find({ createdAt: { $gte: startOfYear } });

    if (reports.length > 0) {
      const totalPercentage = reports.reduce((total, report) => total + report.pourcentage, 0);
      const averagePercentage = totalPercentage / reports.length;

      // Use findOneAndUpdate to avoid duplicate key errors
      await YearlyStats.findOneAndUpdate(
        { year: today.getFullYear() },  // Find the document for the current year
        { averagePercentage },  // Update the average percentage
        { upsert: true, new: true, setDefaultsOnInsert: true }  // Create if not exist
      );

      console.log('Yearly statistics saved or updated successfully.');
    } else {
      console.log('No reports found for this year.');
    }
  } catch (error) {
    console.error('Error calculating yearly statistics:', error);
  }
};

export const getDailyStats = async (req, res) => {
  try {
    const dailyStats = await DailyStats.find(); // Fetch daily stats from DB
    console.log("statistique du jour",dailyStats);
    res.status(200).json(dailyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily statistics", error });
  }
};

// get week statistics
export const getWeeklyStats = async (req, res) => {
  try {
    const weeklyStats = await WeeklyStats.find(); // Fetch daily stats from DB
    res.status(200).json(weeklyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily statistics", error });
  }
};
// get Month statistics

export const getMonthlyStats = async (req, res) => {
  try {
    const monthlyStats = await MonthlyStats.find(); // Fetch daily stats from DB
    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily statistics", error });
  }
};
// get Years statistics
export const getYearlyStats = async (req, res) => {
  try {
    const yearlyStats = await YearlyStats.find(); // Fetch daily stats from DB
    res.status(200).json(yearlyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily statistics", error });
  }
};


// Repeat similarly for getWeeklyStats, getMonthlyStats, and getYearlyStats

