import mongoose, { Schema, Document, Types } from 'mongoose';

// Sentimentos fixos do dropdown
export const FEELINGS = [
  'Muito Feliz',
  'Irritado',
  'Neutro',
  'Triste',
  'Muito Triste',
] as const;

export type FeelingValue = (typeof FEELINGS)[number];

/**
 * Documento = 1 usuário + 1 dia
 * day no formato 'YYYY-MM-DD' (string) para evitar problemas de timezone.
 * Recomendado gerar no backend a partir do TZ do usuário (America/Sao_Paulo).
 */
export interface IFeelingDay extends Document {
  user_id: Types.ObjectId; // ref User
  day: string; // 'YYYY-MM-DD' (ex.: '2025-10-21')
  sentimento_de_entrada: FeelingValue; // dropdown
  sentimento_de_saida: FeelingValue; // dropdown
  createdAt: Date;
  updatedAt: Date;
}

const YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

const FeelingDaySchema = new Schema<IFeelingDay>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user_id é obrigatório'],
      index: true,
    },
    day: {
      type: String,
      required: [true, 'day (YYYY-MM-DD) é obrigatório'],
      validate: {
        validator: (v: string) => YYYYMMDD.test(v),
        message: 'day deve estar no formato YYYY-MM-DD',
      },
      index: true,
      trim: true,
    },
    sentimento_de_entrada: {
      type: String,
      enum: FEELINGS,
      required: [true, 'sentimento_de_entrada é obrigatório'],
      trim: true,
    },
    sentimento_de_saida: {
      type: String,
      enum: FEELINGS,
      required: [true, 'sentimento_de_saida é obrigatório'],
      trim: true,
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

// Garante 1 registro por usuário por dia
FeelingDaySchema.index({ user_id: 1, day: 1 }, { unique: true });

// Consulta recente por usuário
FeelingDaySchema.index({ user_id: 1, createdAt: -1 });

const FeelingModel =
  mongoose.models.FeelingDay ||
  mongoose.model<IFeelingDay>('FeelingDay', FeelingDaySchema);

export default FeelingModel;
