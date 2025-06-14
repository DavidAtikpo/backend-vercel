import { DailyStats, WeeklyStats, MonthlyStats, YearlyStats } from '../models/Statistics.js';
import Out from '../models/userReport.js'; // Votre modèle `UserReport`
import Children from '../models/childrenModel.js';
import User from '../models/userModel.js';
import Goals from '../models/goalsModel.js';
import mongoose from 'mongoose';

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

// ==================== FONCTIONS DE RÉCUPÉRATION DES STATISTIQUES ====================

export const getDailyStats = async (req, res) => {
  try {
    const dailyStats = await DailyStats.find({}).sort({ date: -1 });
    // Map to include dayOfWeek in response
    const formattedStats = dailyStats.map(stat => ({
      date: stat.date,
      day: stat.dayOfWeek,
      averagePercentage: stat.averagePercentage
    }));

    console.log("Statistiques du jour", formattedStats);
    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily statistics", error });
  }
};

// Récupérer les statistiques hebdomadaires avec le numéro de semaine
export const getWeeklyStats = async (req, res) => {
  try {
    const weeklyStats = await WeeklyStats.find().sort({ weekStart: -1 });
    res.status(200).json(weeklyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weekly statistics", error });
  }
};

// Récupérer les statistiques mensuelles avec le nom du mois
export const getMonthlyStats = async (req, res) => {
  try {
    const monthlyStats = await MonthlyStats.find().sort({ month: -1 });
    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly statistics", error });
  }
};

// Récupérer les statistiques annuelles
export const getYearlyStats = async (req, res) => {
  try {
    const yearlyStats = await YearlyStats.find().sort({ year: -1 });
    res.status(200).json(yearlyStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching yearly statistics", error });
  }
};

// ==================== NOUVELLES FONCTIONS POUR L'ADMIN ====================

// Récupérer toutes les statistiques globales du système
export const getGlobalStats = async (req, res) => {
  try {
    // Compter les utilisateurs par rôle
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Compter le total des enfants
    const totalChildren = await Children.countDocuments();

    // Compter les enfants par sexe
    const childrenByGender = await Children.aggregate([
      {
        $group: {
          _id: "$sex",
          count: { $sum: 1 }
        }
      }
    ]);

    // Compter les enfants par classe
    const childrenByClass = await Children.aggregate([
      {
        $match: { class: { $ne: null, $ne: "" } }
      },
      {
        $group: {
          _id: "$class",
          count: { $sum: 1 }
        }
      }
    ]);

    // Compter le total des rapports
    const totalReports = await Out.countDocuments();

    // Compter le total des objectifs
    const totalGoals = await Goals.countDocuments();

    // Calculer la moyenne générale des pourcentages
    const averagePerformance = await Out.aggregate([
      {
        $group: {
          _id: null,
          averagePercentage: { $avg: "$pourcentage" }
        }
      }
    ]);

    // Rapports par mois (derniers 12 mois)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const reportsByMonth = await Out.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          averagePercentage: { $avg: "$pourcentage" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const globalStats = {
      users: {
        total: userStats.reduce((sum, stat) => sum + stat.count, 0),
        byRole: userStats
      },
      children: {
        total: totalChildren,
        byGender: childrenByGender,
        byClass: childrenByClass
      },
      reports: {
        total: totalReports,
        averagePerformance: averagePerformance[0]?.averagePercentage || 0,
        byMonth: reportsByMonth
      },
      goals: {
        total: totalGoals
      }
    };

    res.status(200).json(globalStats);
  } catch (error) {
    console.error('Error fetching global statistics:', error);
    res.status(500).json({ message: "Error fetching global statistics", error });
  }
};

// Récupérer les statistiques détaillées des utilisateurs
export const getUsersStats = async (req, res) => {
  try {
    // Utilisateurs avec leurs rapports
    const usersWithReports = await User.aggregate([
      {
        $lookup: {
          from: "outs", // Collection des rapports
          localField: "_id",
          foreignField: "postedBy",
          as: "reports"
        }
      },
      {
        $lookup: {
          from: "goals", // Collection des objectifs
          localField: "_id",
          foreignField: "postedBy",
          as: "goals"
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          role: 1,
          isVerified: 1,
          createdAt: 1,
          reportsCount: { $size: "$reports" },
          goalsCount: { $size: "$goals" },
          averagePerformance: { $avg: "$reports.pourcentage" },
          lastReportDate: { $max: "$reports.createdAt" }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json(usersWithReports);
  } catch (error) {
    console.error('Error fetching users statistics:', error);
    res.status(500).json({ message: "Error fetching users statistics", error });
  }
};

// Récupérer les statistiques détaillées des enfants
export const getChildrenStats = async (req, res) => {
  try {
    // Statistiques par âge
    const childrenByAge = await Children.aggregate([
      {
        $addFields: {
          age: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), { $dateFromString: { dateString: "$birthDate" } }] },
                365.25 * 24 * 60 * 60 * 1000
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$age",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Enfants récemment inscrits (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentChildren = await Children.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    // Statistiques par lieu de résidence
    const childrenByLocation = await Children.aggregate([
      {
        $match: { live: { $ne: null, $ne: "" } }
      },
      {
        $group: {
          _id: "$live",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const childrenStats = {
      byAge: childrenByAge,
      byLocation: childrenByLocation,
      recentRegistrations: recentChildren.length,
      recentChildren: recentChildren
    };

    res.status(200).json(childrenStats);
  } catch (error) {
    console.error('Error fetching children statistics:', error);
    res.status(500).json({ message: "Error fetching children statistics", error });
  }
};

// Récupérer les statistiques des rapports avec détails
export const getReportsStats = async (req, res) => {
  try {
    // Rapports avec informations utilisateur
    const reportsWithUsers = await Out.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          justification: 1,
          choix: 1,
          pourcentage: 1,
          createdAt: 1,
          userName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          userRole: "$user.role"
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // Distribution des pourcentages
    const percentageDistribution = await Out.aggregate([
      {
        $bucket: {
          groupBy: "$pourcentage",
          boundaries: [0, 20, 40, 60, 80, 100],
          default: "Other",
          output: {
            count: { $sum: 1 },
            averagePercentage: { $avg: "$pourcentage" }
          }
        }
      }
    ]);

    // Rapports par choix
    const reportsByChoice = await Out.aggregate([
      {
        $group: {
          _id: "$choix",
          count: { $sum: 1 },
          averagePercentage: { $avg: "$pourcentage" }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const reportsStats = {
      reports: reportsWithUsers,
      percentageDistribution,
      byChoice: reportsByChoice,
      total: reportsWithUsers.length
    };

    res.status(200).json(reportsStats);
  } catch (error) {
    console.error('Error fetching reports statistics:', error);
    res.status(500).json({ message: "Error fetching reports statistics", error });
  }
};

// Récupérer les statistiques des objectifs
export const getGoalsStats = async (req, res) => {
  try {
    // Objectifs avec informations utilisateur
    const goalsWithUsers = await Goals.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          sunday: 1,
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          createdAt: 1,
          userName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          userRole: "$user.role"
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // Compter les objectifs par utilisateur
    const goalsByUser = await Goals.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $group: {
          _id: "$postedBy",
          userName: { $first: { $concat: ["$user.firstName", " ", "$user.lastName"] } },
          userRole: { $first: "$user.role" },
          goalsCount: { $sum: 1 },
          lastGoalDate: { $max: "$createdAt" }
        }
      },
      {
        $sort: { goalsCount: -1 }
      }
    ]);

    const goalsStats = {
      goals: goalsWithUsers,
      byUser: goalsByUser,
      total: goalsWithUsers.length
    };

    res.status(200).json(goalsStats);
  } catch (error) {
    console.error('Error fetching goals statistics:', error);
    res.status(500).json({ message: "Error fetching goals statistics", error });
  }
};

// Récupérer le tableau de bord complet pour l'admin
export const getAdminDashboard = async (req, res) => {
  try {
    // Statistiques rapides
    const totalUsers = await User.countDocuments();
    const totalChildren = await Children.countDocuments();
    const totalReports = await Out.countDocuments();
    const totalGoals = await Goals.countDocuments();

    // Activité récente (derniers 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = {
      newUsers: await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      newChildren: await Children.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      newReports: await Out.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      newGoals: await Goals.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    };

    // Performance moyenne de la semaine
    const weeklyPerformance = await Out.aggregate([
      {
        $match: { createdAt: { $gte: sevenDaysAgo } }
      },
      {
        $group: {
          _id: null,
          averagePercentage: { $avg: "$pourcentage" },
          totalReports: { $sum: 1 }
        }
      }
    ]);

    // Top performers (utilisateurs avec les meilleures moyennes)
    const topPerformers = await Out.aggregate([
      {
        $group: {
          _id: "$postedBy",
          averagePercentage: { $avg: "$pourcentage" },
          reportsCount: { $sum: 1 }
        }
      },
      {
        $match: { reportsCount: { $gte: 3 } } // Au moins 3 rapports
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          userName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          averagePercentage: 1,
          reportsCount: 1
        }
      },
      {
        $sort: { averagePercentage: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const dashboard = {
      totals: {
        users: totalUsers,
        children: totalChildren,
        reports: totalReports,
        goals: totalGoals
      },
      recentActivity,
      weeklyPerformance: weeklyPerformance[0] || { averagePercentage: 0, totalReports: 0 },
      topPerformers
    };

    res.status(200).json(dashboard);
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: "Error fetching admin dashboard", error });
  }
};

// Fonction pour recalculer toutes les statistiques
export const recalculateAllStats = async (req, res) => {
  try {
    await calculateDailyStats();
    await calculateWeeklyStats();
    await calculateMonthlyStats();
    await calculateYearlyStats();
    
    res.status(200).json({ message: "All statistics recalculated successfully" });
  } catch (error) {
    console.error('Error recalculating statistics:', error);
    res.status(500).json({ message: "Error recalculating statistics", error });
  }
};

