import mongoose from 'mongoose';
import moment from 'moment';

const dailyStatsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  averagePercentage: { type: Number, required: true },
  dayOfWeek: { type: String, required: true }
});

dailyStatsSchema.pre('save', function (next) {
  this.dayOfWeek = moment(this.date).format('dddd');
  next();
});

const weeklyStatsSchema = new mongoose.Schema({
  weekStart: { type: Date, required: true, unique: true },
  averagePercentage: { type: Number, required: true },
  monthName: { type: String, required: true },
  weekNumber: { type: Number, required: true }
});

weeklyStatsSchema.pre('save', function (next) {
  const weekStart = moment(this.weekStart);
  this.monthName = weekStart.format('MMMM');
  this.weekNumber = weekStart.week();
  next();
});

const monthlyStatsSchema = new mongoose.Schema({
  month: { type: Date, required: true, unique: true },
  averagePercentage: { type: Number, required: true },
  monthName: { type: String, required: true }
});

monthlyStatsSchema.pre('save', function (next) {
  this.monthName = moment(this.month).format('MMMM');
  next();
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
