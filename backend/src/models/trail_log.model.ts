import mongoose, { Schema, Document, Types } from 'mongoose';
import { FeelingValue } from './feeling.model';

const YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

export type TrailFeelingSource = 'entrada' | 'saida' | 'bot' | 'manual';

export interface ITrailExecution {
  trail_id: Types.ObjectId; // ref Trail
  diaDaTrilha: number; // 1..7
  sentimentoDisparador?: FeelingValue | string;
  origemSentimento?: TrailFeelingSource;
  concluidoEm: Date; // timestamp real da conclusão
}

export interface ITrailLogDay extends Document {
  user_id: Types.ObjectId;
  day: string; // 'YYYY-MM-DD'
  exercicios: ITrailExecution[]; // lista de exercícios concluídos nesse dia
  createdAt: Date;
  updatedAt: Date;
}

const TrailExecutionSchema = new Schema<ITrailExecution>(
  {
    trail_id: {
      type: Schema.Types.ObjectId,
      ref: 'Trail',
      required: true,
    },
    diaDaTrilha: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    sentimentoDisparador: {
      type: String,
      trim: true,
    },
    origemSentimento: {
      type: String,
      enum: ['entrada', 'saida', 'bot', 'manual'],
      default: 'bot',
    },
    concluidoEm: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);

const TrailLogDaySchema = new Schema<ITrailLogDay>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    day: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => YYYYMMDD.test(v),
        message: 'day deve estar no formato YYYY-MM-DD',
      },
      index: true,
      trim: true,
    },
    exercicios: {
      type: [TrailExecutionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Garante 1 documento por usuário por dia
TrailLogDaySchema.index({ user_id: 1, day: 1 }, { unique: true });

const TrailLogModel =
  mongoose.models.TrailLogDay ||
  mongoose.model<ITrailLogDay>('TrailLogDay', TrailLogDaySchema);

export default TrailLogModel;
