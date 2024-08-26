import mongoose from 'mongoose';

const dailyStatsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  averagePercentage: { type: Number, required: true },
  dayOfWeek: { type: String, required: true }
});

const weeklyStatsSchema = new mongoose.Schema({
  weekStart: { type: Date, required: true, unique: true },
  averagePercentage: { type: Number, required: true }
});

const monthlyStatsSchema = new mongoose.Schema({
  month: { type: Date, required: true, unique: true },
  averagePercentage: { type: Number, required: true }
});

const yearlyStatsSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  averagePercentage: { type: Number, required: true }
});

const DailyStats = mongoose.model('DailyStats', dailyStatsSchema);
const WeeklyStats = mongoose.model('WeeklyStats', weeklyStatsSchema);
const MonthlyStats = mongoose.model('MonthlyStats', monthlyStatsSchema);
const YearlyStats = mongoose.model('YearlyStats', yearlyStatsSchema);

export { DailyStats, WeeklyStats, MonthlyStats, YearlyStats };
