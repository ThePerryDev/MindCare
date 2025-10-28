import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Chave do Map = dia normalizado 'YYYY-MM-DD'
 * Valor = dados do dia: sentimento (livre) e um label opcional para exibição
 *  - exemplo de chave: '2025-10-21'
 *  - exemplo de label: '21/10/2025' ou '23 de outubro'
 */
export interface IFeelingBotDay {
  sentimento: string;   // vindo de API externa (não é enum)
  label?: string;       // formato amigável para exibição (opcional)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFeelingBot extends Document {
  user_id: Types.ObjectId;                     // um doc por usuário
  days: Map<string, IFeelingBotDay>;           // chave: 'YYYY-MM-DD'
  createdAt: Date;
  updatedAt: Date;
}

const FeelingBotDaySchema = new Schema<IFeelingBotDay>(
  {
    sentimento: { type: String, required: [true, 'sentimento é obrigatório'] },
    label: { type: String, trim: true },
  },
  { _id: false, timestamps: true } // timestamps por subdocumento do dia
);

const FeelingBotSchema = new Schema<IFeelingBot>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user_id é obrigatório'],
      index: true,
      unique: true, // garante 1 documento por usuário
    },
    // Map onde a chave é 'YYYY-MM-DD' e o valor segue o schema acima
    days: {
      type: Map,
      of: FeelingBotDaySchema,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;

        // Converte Map em array ordenada por dia (desc) para facilitar consumo no frontend
        if (ret.days && ret.days instanceof Map) {
          const entries = Array.from(ret.days.entries()).map(([day, v]: any) => ({
            day,
            sentimento: v.sentimento,
            label: v.label,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
          }));
          entries.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));
          ret.days = entries;
        }
      },
    },
  }
);

// Índice útil caso queira consultar por atualização recente
FeelingBotSchema.index({ updatedAt: -1 });

const FeelingBotModel =
  mongoose.models.FeelingBot ||
  mongoose.model<IFeelingBot>('FeelingBot', FeelingBotSchema);

export default FeelingBotModel;
