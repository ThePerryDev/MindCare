// backend/src/server.ts
import 'dotenv/config';
import app from './app';
import { connect } from './database/connection';
import { ensureDefaultTrails } from './database/seedTrails';

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindcare';

async function start() {
  try {
    // 1. Conecta no Mongo usando a mesma lógica que já funcionava antes
    await connect(MONGO_URI);

    // 2. Garante que as trilhas sejam criadas/atualizadas
    await ensureDefaultTrails();
    console.log('[trails] trilhas padrão criadas/atualizadas com sucesso');

    // 3. Sobe a API igual antes
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Server ouvindo em http://192.168.18.46:${PORT}`)
    );
  } catch (e) {
    console.error('Falha ao iniciar', e);
    process.exit(1);
  }
}

start();
