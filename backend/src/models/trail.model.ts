// src/models/trail.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { FEELINGS, FeelingValue } from './feeling.model';

export type TrailCode =
  | 'TRILHA_ANSIEDADE_LEVE'
  | 'TRILHA_ESTRESSE_TRABALHO'
  | 'TRILHA_SONO_RELAX'
  | 'TRILHA_HUMOR_POSITIVO'
  | 'TRILHA_MUITO_FELIZ'
  | 'TRILHA_NEUTRO'
  | 'TRILHA_TRISTE'
  | 'TRILHA_IRRITADO'
  | 'TRILHA_MUITO_TRISTE';

export interface ITrailStep {
  ordem: number; // 1..7
  titulo: string;
  descricao?: string;
  duracaoMinutos?: number; // pode ser undefined quando for '---'
  objetivo?: string;
}

export interface ITrail extends Document {
  trailId: number; // ID curto e estável para uso no app (1..9)
  code: TrailCode; // chave estável pra seed
  nome: string; // "Trilha 1 - Ansiedade Leve / Foco no Presente"
  descricao?: string;
  dias: ITrailStep[]; // 7 micro-hábitos
  sentimentosRecomendados: FeelingValue[]; // ligação com FEELINGS
  createdAt: Date;
  updatedAt: Date;
}

const TrailStepSchema = new Schema<ITrailStep>(
  {
    ordem: { type: Number, required: true, min: 1, max: 7 },
    titulo: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    duracaoMinutos: { type: Number, min: 1 },
    objetivo: { type: String, trim: true },
  },
  { _id: false }
);

const TrailSchema = new Schema<ITrail>(
  {
    trailId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
    dias: {
      type: [TrailStepSchema],
      validate: {
        validator: (arr: ITrailStep[]) => arr.length === 7,
        message: 'cada trilha deve ter exatamente 7 dias',
      },
    },
    sentimentosRecomendados: {
      type: [String],
      enum: FEELINGS,
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

const TrailModel =
  mongoose.models.Trail || mongoose.model<ITrail>('Trail', TrailSchema);

export default TrailModel;
