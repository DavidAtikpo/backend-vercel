import mongoose from'mongoose';

const weeklyStatsSchema = new mongoose.Schema({
    weekStartDate: { type: Date, required: true },       // Date de début de la semaine
    weekEndDate: { type: Date, required: true },         // Date de fin de la semaine
    pourcentage: { type: Number, required: true },       // Pourcentage moyen pour la semaine
    dailyPercentages: [{                                 // Pourcentage pour chaque jour de la semaine
      day: { type: String },                             // Jour de la semaine (par exemple, 'Monday')
      pourcentage: { type: Number }
    }],
    // Ajoutez d'autres champs si nécessaire
  }, { timestamps: true });
  
  const WeeklyStats = mongoose.model('WeeklyStats', weeklyStatsSchema);
  
  export default WeeklyStats;
  