// src/models/user.model.ts

import mongoose, { Schema, Document } from 'mongoose';

// Interface do documento
export interface IUser extends Document {
  fullName: string; // Nome Completo
  email: string; // E-mail
  phone: string; // Telefone (formato brasileiro)
  birthdate: Date; // Data de Nascimento
  height: number; // Altura em cm
  weight: number; // Peso em kg
  password: string; // Senha (hash)
  // OBS: confirmação de senha é validada na camada de serviço/DTO e não é persistida
  resetPasswordCode?: string | null;
  resetPasswordExpires?: Date | null;
}

// Regras de validação
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneBRRegex = /^\(?\d{2}\)?\d{4,5}-?\d{4}$/; // (99)99999-9999
const passwordPolicy = [
  {
    validator: (v: string) => /[A-Z]/.test(v),
    message: 'A senha precisa de ao menos uma letra maiúscula.',
  },
  {
    validator: (v: string) => /[a-z]/.test(v),
    message: 'A senha precisa de ao menos uma letra minúscula.',
  },
  {
    validator: (v: string) => /\d/.test(v),
    message: 'A senha precisa de ao menos um número.',
  },
  {
    validator: (v: string) => v.length >= 8,
    message: 'A senha deve ter pelo menos 8 caracteres.',
  },
];

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'O nome completo é obrigatório'],
      trim: true,
      minlength: [3, 'Informe um nome válido'],
      maxlength: [120, 'O nome deve ter no máximo 120 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [80, 'O e-mail deve ter no máximo 80 caracteres'],
      validate: {
        validator: (v: string) => emailRegex.test(v),
        message: 'O e-mail informado não é válido',
      },
    },
    phone: {
      type: String,
      required: [true, 'O telefone é obrigatório'],
      trim: true,
      validate: {
        validator: (v: string) => phoneBRRegex.test(v.replace(/\s/g, '')),
        message: 'O telefone deve estar no formato (99)99999-9999',
      },
    },
    birthdate: {
      type: Date,
      required: [true, 'A data de nascimento é obrigatória'],
      validate: {
        validator: (d: Date) => d < new Date(),
        message: 'A data de nascimento deve ser no passado',
      },
    },
    height: {
      type: Number,
      required: [true, 'A altura é obrigatória'],
      min: [30, 'Altura mínima inválida'],
      max: [300, 'Altura máxima inválida'],
    },
    weight: {
      type: Number,
      required: [true, 'O peso é obrigatório'],
      min: [1, 'Peso mínimo inválido'],
      max: [700, 'Peso máximo inválido'],
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      validate: passwordPolicy, // 8+, 1 maiús, 1 minús, 1 número
      select: false, // nunca retorna por padrão
    },
    //Campos para Reset de Senha
    resetPasswordCode: {
      type: String,
      select: false,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password; // garante que não vaze mesmo se select:true
        delete ret.resetPasswordCode;
        delete ret.resetPasswordExpires;
      },
    },
  }
);

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
