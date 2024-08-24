import mongoose from'mongoose';

const yearlyStatsSchema = new mongoose.Schema({
    year: { type: Number, required: true, unique: true },  // Année
    pourcentage: { type: Number, required: true },         // Pourcentage moyen pour l'année
    monthlyPercentages: [{                                 // Pourcentage pour chaque mois de l'année
      month: { type: String },
      pourcentage: { type: Number }
    }],
    // Ajoutez d'autres champs si nécessaire
  }, { timestamps: true });
  
  const YearlyStats = mongoose.model('YearlyStats', yearlyStatsSchema);
  
  export default YearlyStats;
  