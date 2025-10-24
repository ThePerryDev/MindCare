"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Regras de validação
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneBRRegex = /^\(?\d{2}\)?\d{4,5}-?\d{4}$/; // (99)99999-9999
const passwordPolicy = [
    {
        validator: (v) => /[A-Z]/.test(v),
        message: 'A senha precisa de ao menos uma letra maiúscula.',
    },
    {
        validator: (v) => /[a-z]/.test(v),
        message: 'A senha precisa de ao menos uma letra minúscula.',
    },
    {
        validator: (v) => /\d/.test(v),
        message: 'A senha precisa de ao menos um número.',
    },
    {
        validator: (v) => v.length >= 8,
        message: 'A senha deve ter pelo menos 8 caracteres.',
    },
];
const UserSchema = new mongoose_1.Schema({
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
            validator: (v) => emailRegex.test(v),
            message: 'O e-mail informado não é válido',
        },
    },
    phone: {
        type: String,
        required: [true, 'O telefone é obrigatório'],
        trim: true,
        validate: {
            validator: (v) => phoneBRRegex.test(v.replace(/\s/g, '')),
            message: 'O telefone deve estar no formato (99)99999-9999',
        },
    },
    birthdate: {
        type: Date,
        required: [true, 'A data de nascimento é obrigatória'],
        validate: {
            validator: (d) => d < new Date(),
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
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password; // garante que não vaze mesmo se select:true
        },
    },
});
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.default = UserModel;
