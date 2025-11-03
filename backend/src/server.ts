// backend/src/server.ts
import 'dotenv/config';
import app from './app';
import { connect } from './database/connection';

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindcare';

async function start() {
  try {
    await connect(MONGO_URI);
    // força bind na LAN tb
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Server ouvindo em http://192.168.18.20:${PORT}`)
    );
  } catch (e) {
    console.error('Falha ao iniciar', e);
    process.exit(1);
  }
}
start();
