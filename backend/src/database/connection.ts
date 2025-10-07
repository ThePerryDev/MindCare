// src/database/connection.ts
import mongoose from 'mongoose';

export async function connect(uri: string) {
  // Event handlers úteis para observabilidade
  mongoose.connection.on('connected', () => console.log('[mongo] connected'));
  mongoose.connection.on('open', () => console.log('[mongo] open'));
  mongoose.connection.on('disconnected', () =>
    console.log('[mongo] disconnected')
  );
  mongoose.connection.on('reconnected', () =>
    console.log('[mongo] reconnected')
  );
  mongoose.connection.on('disconnecting', () =>
    console.log('[mongo] disconnecting')
  );
  mongoose.connection.on('close', () => console.log('[mongo] close'));
  mongoose.connection.on('error', e => console.error('[mongo] error', e));

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  });

  console.log('[mongo] Conectado ao MongoDB');

  // Encerramento gracioso
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('[mongo] conexão fechada (SIGINT)');
      process.exit(0);
    } catch (error) {
      console.error('[mongo] erro ao fechar conexão', error);
      process.exit(1);
    }
  });
}
