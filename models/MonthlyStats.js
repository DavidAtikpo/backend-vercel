import mongoose from'mongoose';

const monthlyStatsSchema = new mongoose.Schema({
    month: { type: String, required: true },             // Mois (par exemple, 'August')
    year: { type: Number, required: true },              // Année
    pourcentage: { type: Number, required: true },       // Pourcentage moyen pour le mois
    weeklyPercentages: [{                                // Pourcentage pour chaque semaine du mois
      weekStartDate: { type: Date },
      pourcentage: { type: Number }
    }],
    // Ajoutez d'autres champs si nécessaire
  }, { timestamps: true });
  
  const MonthlyStats = mongoose.model('MonthlyStats', monthlyStatsSchema);
  
  export default MonthlyStats;
  