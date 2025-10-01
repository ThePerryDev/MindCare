// src/server.ts
import 'dotenv/config';
import app from './app';
import { connect } from './database/connection';

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindcare';

async function start() {
  try {
    await connect(MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server ouvindo em http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error('Falha ao iniciar', e);
    process.exit(1);
  }
}

start();
