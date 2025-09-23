// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface NotificationPrefs {
  dailyTime: string;
  muted: boolean;
  muteUntil?: Date;
}

export interface Streak {
  current: number;
  best: number;
  updatedAt: Date;
}

export interface WeeklyCounts {
  completed: number;
}

export interface IUser extends Document {
  authId: string;
  email?: string;
  phone?: string;
  name?: string;
  timezone: string;
  consentVersion?: string;
  notificationPrefs: NotificationPrefs;
  streak: Streak;
  weeklyCounts: WeeklyCounts;
  createdAt: Date;
  createdAtISO?: string;
}

const NotificationPrefsSchema = new Schema<NotificationPrefs>(
  {
    dailyTime: { type: String, default: '19:00' },
    muted: { type: Boolean, default: false },
    muteUntil: { type: Date },
  },
  { _id: false }
);

const StreakSchema = new Schema<Streak>(
  {
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WeeklyCountsSchema = new Schema<WeeklyCounts>(
  {
    completed: { type: Number, default: 0 },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    authId: { type: String, required: true, unique: true },
    email: {
      type: String,
      index: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, index: true, sparse: true },
    name: { type: String, trim: true, maxlength: 80 },
    timezone: { type: String, required: true, default: 'America/Sao_Paulo' },
    consentVersion: { type: String },
    notificationPrefs: { type: NotificationPrefsSchema, default: () => ({}) },
    streak: { type: StreakSchema, default: () => ({}) },
    weeklyCounts: { type: WeeklyCountsSchema, default: () => ({}) },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.index({ 'streak.updatedAt': -1 });

UserSchema.virtual('createdAtISO').get(function () {
  return (this as IUser).createdAt?.toISOString?.();
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
