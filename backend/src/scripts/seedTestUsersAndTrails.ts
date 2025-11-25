// src/scripts/seedTestUsersAndTrails.ts

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connect } from '../database/connection';
import { ensureDefaultTrails } from '../database/seedTrails';
import UserModel, { IUser } from '../models/user.model';
import TrailModel, { ITrail } from '../models/trail.model';
import TrailLogModel from '../models/trail_log.model';
import FeelingModel, { FeelingValue } from '../models/feeling.model';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindcare';

/**
 * Formata a data como YYYY-MM-DD
 */
function formatDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Soma dias (pode ser negativo)
 */
function addDays(base: Date, days: number): Date {
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Cria uma Date fixa no meio do dia (para evitar problemas de timezone com UTC)
 */
function makeDate(dayStr: string): Date {
  // Ex: '2025-11-23' -> 2025-11-23T12:00:00Z
  return new Date(`${dayStr}T12:00:00.000Z`);
}

// Mapeia trilha -> sentimento principal (4 emoções)
function feelingForTrail(code: string): FeelingValue {
  switch (code) {
    case 'TRILHA_ANSIEDADE_LEVE':
      return 'Ansiedade';
    case 'TRILHA_ESTRESSE_TRABALHO':
      return 'Estresse';
    case 'TRILHA_MUITO_FELIZ':
      return 'Felicidade';
    case 'TRILHA_MUITO_TRISTE':
    default:
      return 'Tristeza';
  }
}

/**
 * Cria/atualiza um registro de feeling para um usuário em um certo dia.
 * Para fins de seed, usamos o mesmo sentimento na entrada e na saída.
 */
async function upsertFeelingForUserDay(params: {
  userId: mongoose.Types.ObjectId;
  date: Date;
  sentimento: FeelingValue;
}) {
  const { userId, date, sentimento } = params;
  const dayStr = formatDay(date);

  await FeelingModel.findOneAndUpdate(
    { user_id: userId, day: dayStr },
    {
      $setOnInsert: {
        user_id: userId,
        day: dayStr,
      },
      $set: {
        sentimento_de_entrada: sentimento,
        sentimento_de_saida: sentimento,
      },
    },
    { upsert: true, new: true }
  );
}

/**
 * Adiciona um exercício concluído para um usuário em um certo dia
 */
async function addExecutionForUserDay(params: {
  userId: mongoose.Types.ObjectId;
  trail: ITrail;
  diaDaTrilha: number;
  date: Date;
  sentimento?: FeelingValue;
}) {
  const { userId, trail, diaDaTrilha, date, sentimento } = params;
  const dayStr = formatDay(date);

  const exec = {
    trail_id: trail._id,
    diaDaTrilha,
    sentimentoDisparador: sentimento,
    origemSentimento: 'manual' as const,
    concluidoEm: date,
  };

  await TrailLogModel.findOneAndUpdate(
    { user_id: userId, day: dayStr },
    {
      $setOnInsert: { user_id: userId, day: dayStr },
      $push: { exercicios: exec },
    },
    { upsert: true, new: true }
  );

  // Se tiver sentimento, também garantimos um registro em FeelingModel
  if (sentimento) {
    await upsertFeelingForUserDay({ userId, date, sentimento });
  }
}

type TrailKey = 'ansiedade' | 'estresse' | 'muitoFeliz' | 'muitoTriste';

interface TestUserConfig {
  fullName: string;
  email: string;
  phone: string;
  birthdateStr: string;
  height: number;
  weight: number;
  progress: Record<TrailKey, number>; // quantos/7
  latestTrail: TrailKey; // trilha cuja última atividade é a mais recente (23/11/2025)
}

async function main() {
  console.log('🔗 Conectando ao MongoDB...');
  await connect(MONGO_URI);

  console.log('⛏️  Garantindo trilhas padrão...');
  await ensureDefaultTrails();

  const trails = await TrailModel.find().sort({ trailId: 1 });
  if (!trails.length) {
    throw new Error('Nenhuma trilha encontrada. Verifique o seedTrails.');
  }

  console.log(
    '✅ Trilhas carregadas:',
    trails.map(t => `${t.trailId}-${t.code}`)
  );

  // Localiza as 4 trilhas principais
  const trilhaAnsiedade = trails.find(t => t.code === 'TRILHA_ANSIEDADE_LEVE');
  const trilhaEstresse = trails.find(
    t => t.code === 'TRILHA_ESTRESSE_TRABALHO'
  );
  const trilhaMuitoFeliz = trails.find(t => t.code === 'TRILHA_MUITO_FELIZ');
  const trilhaMuitoTriste = trails.find(t => t.code === 'TRILHA_MUITO_TRISTE');

  if (
    !trilhaAnsiedade ||
    !trilhaEstresse ||
    !trilhaMuitoFeliz ||
    !trilhaMuitoTriste
  ) {
    throw new Error(
      'Não foi possível localizar todas as trilhas TRILHA_ANSIEDADE_LEVE, TRILHA_ESTRESSE_TRABALHO, TRILHA_MUITO_FELIZ e TRILHA_MUITO_TRISTE.'
    );
  }

  const trailMap: Record<TrailKey, ITrail> = {
    ansiedade: trilhaAnsiedade,
    estresse: trilhaEstresse,
    muitoFeliz: trilhaMuitoFeliz,
    muitoTriste: trilhaMuitoTriste,
  };

  // --------------------------
  // 1) Configuração dos 5 usuários
  // --------------------------

  const plainPassword = '@Senha123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const testUsersConfig: TestUserConfig[] = [
    {
      // Usuário 1
      fullName: 'User1 Teste',
      email: 'user1.teste@example.com',
      phone: '(11)98888-0001',
      birthdateStr: '1990-01-10',
      height: 170,
      weight: 70,
      // trilha ansiedade: 4/7
      // trilha estresse (data mais recente): 6/7
      // trilha muito feliz: 2/7
      // trilha muito triste: 4/7
      progress: {
        ansiedade: 4,
        estresse: 6,
        muitoFeliz: 2,
        muitoTriste: 4,
      },
      latestTrail: 'estresse',
    },
    {
      // Usuário 2
      fullName: 'User2 Teste',
      email: 'user2.teste@example.com',
      phone: '(11)98888-0002',
      birthdateStr: '1991-02-15',
      height: 165,
      weight: 65,
      // trilha ansiedade (data mais recente): 6/7
      // trilha estresse: 3/7
      // trilha muito feliz: 1/7
      // trilha muito triste: 5/7
      progress: {
        ansiedade: 6,
        estresse: 3,
        muitoFeliz: 1,
        muitoTriste: 5,
      },
      latestTrail: 'ansiedade',
    },
    {
      // Usuário 3
      fullName: 'User3 Teste',
      email: 'user3.teste@example.com',
      phone: '(11)98888-0003',
      birthdateStr: '1992-03-20',
      height: 180,
      weight: 82,
      // trilha ansiedade: 2/7
      // trilha estresse: 2/7
      // trilha muito feliz (data mais recente): 6/7
      // trilha muito triste: 2/7
      progress: {
        ansiedade: 2,
        estresse: 2,
        muitoFeliz: 6,
        muitoTriste: 2,
      },
      latestTrail: 'muitoFeliz',
    },
    {
      // Usuário 4
      fullName: 'User4 Teste',
      email: 'user4.teste@example.com',
      phone: '(11)98888-0004',
      birthdateStr: '1993-04-05',
      height: 172,
      weight: 76,
      // trilha ansiedade: 1/7
      // trilha estresse: 6/7
      // trilha muito feliz: 2/7
      // trilha muito triste (data mais recente): 7/7
      progress: {
        ansiedade: 1,
        estresse: 6,
        muitoFeliz: 2,
        muitoTriste: 7,
      },
      latestTrail: 'muitoTriste',
    },
    {
      // Usuário 5 (completo em todas as trilhas)
      fullName: 'User5 Teste',
      email: 'user5.teste@example.com',
      phone: '(11)98888-0005',
      birthdateStr: '1990-05-18',
      height: 175,
      weight: 80,
      // trilha ansiedade: 7/7
      // trilha estresse (data mais recente): 7/7
      // trilha muito feliz: 7/7
      // trilha muito triste: 7/7
      progress: {
        ansiedade: 7,
        estresse: 7,
        muitoFeliz: 7,
        muitoTriste: 7,
      },
      latestTrail: 'estresse',
    },
  ];

  const emails = testUsersConfig.map(u => u.email);

  // --------------------------
  // 2) Limpando usuários/logs/feelings anteriores de teste
  // --------------------------

  console.log('🧹 Buscando usuários de teste anteriores...');
  const existingUsers = await UserModel.find({ email: { $in: emails } }).select(
    '_id email'
  );

  if (existingUsers.length > 0) {
    const existingIds = existingUsers.map(u => u._id);
    console.log(
      '🧹 Removendo TrailLogs de usuários de teste anteriores:',
      existingUsers.map(u => u.email)
    );
    await TrailLogModel.deleteMany({ user_id: { $in: existingIds } });

    console.log('🧹 Removendo Feelings de usuários de teste anteriores...');
    await FeelingModel.deleteMany({ user_id: { $in: existingIds } });

    console.log('🧹 Removendo usuários de teste anteriores...');
    await UserModel.deleteMany({ _id: { $in: existingIds } });
  }

  // --------------------------
  // 3) Criando os 5 usuários
  // --------------------------

  console.log('👤 Criando 5 usuários de teste...');
  const createdUsers: IUser[] = [];

  for (const cfg of testUsersConfig) {
    const user = await UserModel.create({
      fullName: cfg.fullName,
      email: cfg.email,
      phone: cfg.phone,
      birthdate: new Date(cfg.birthdateStr),
      height: cfg.height,
      weight: cfg.weight,
      password: hashedPassword,
    });
    createdUsers.push(user);
    console.log(`  ➕ Usuário criado: ${user.fullName} (${user.email})`);
  }

  // Segurança extra: limpar qualquer log/feeling residual desses 5 usuários recém criados
  const testUserIds = createdUsers.map(u => u._id);
  await TrailLogModel.deleteMany({ user_id: { $in: testUserIds } });
  await FeelingModel.deleteMany({ user_id: { $in: testUserIds } });

  // --------------------------
  // 4) Criar usos de trilhas com os padrões pedidos
  // --------------------------

  // Datas de referência:
  // As datas MAIS RECENTES podem estar na semana 16/11/2025 a 23/11/2025,
  // sendo 23/11/2025 o dia mais recente (último salvo).
  const latestDayStr = '2025-11-23';

  // Datas "base" de término para as trilhas que NÃO são as mais recentes daquele usuário.
  const baseEndDates: Record<TrailKey, string> = {
    ansiedade: '2025-11-20',
    estresse: '2025-11-21',
    muitoFeliz: '2025-11-22',
    muitoTriste: '2025-11-19',
  };

  async function seedTrailProgressForUser(
    userId: mongoose.Types.ObjectId,
    cfg: TestUserConfig
  ) {
    const sentimentoPorTrail: Record<TrailKey, FeelingValue> = {
      ansiedade: feelingForTrail(trailMap.ansiedade.code),
      estresse: feelingForTrail(trailMap.estresse.code),
      muitoFeliz: feelingForTrail(trailMap.muitoFeliz.code),
      muitoTriste: feelingForTrail(trailMap.muitoTriste.code),
    };

    const trailKeys: TrailKey[] = [
      'ansiedade',
      'estresse',
      'muitoFeliz',
      'muitoTriste',
    ];

    for (const key of trailKeys) {
      const totalSteps = cfg.progress[key];
      if (!totalSteps || totalSteps <= 0) continue;

      const trail = trailMap[key];

      // Define a data final (última atividade) dessa trilha para este usuário
      const endDayStr =
        key === cfg.latestTrail ? latestDayStr : baseEndDates[key];
      const endDate = makeDate(endDayStr);

      console.log(
        `    ▶️ Usuário ${cfg.email} - trilha ${trail.code} -> ${totalSteps}/7, último dia = ${endDayStr}`
      );

      // Cria registros das atividades de 1 até totalSteps, em ordem crescente,
      // distribuindo as datas de forma crescente até a data final.
      for (let dia = 1; dia <= totalSteps; dia++) {
        const offsetFromEnd = totalSteps - dia;
        const date = addDays(endDate, -offsetFromEnd);

        await addExecutionForUserDay({
          userId,
          trail,
          diaDaTrilha: dia,
          date,
          sentimento: sentimentoPorTrail[key],
        });
      }
    }
  }

  console.log(
    '🧪 Criando históricos de trilhas + feelings conforme especificações...'
  );

  for (let i = 0; i < createdUsers.length; i++) {
    const user = createdUsers[i];
    const cfg = testUsersConfig[i];

    console.log(
      `  👤 Gerando atividades para ${user.fullName} (${user.email})...`
    );
    await seedTrailProgressForUser(user._id as mongoose.Types.ObjectId, cfg);
  }

  console.log(
    '✅ Seed de 5 usuários, trilhas e feelings concluído com sucesso!'
  );
  await mongoose.disconnect();
  console.log('🔌 Conexão encerrada. Fim do script.');
}

main().catch(err => {
  console.error('🔥 Erro no seed:', err);
  mongoose.disconnect().finally(() => {
    process.exit(1);
  });
});
