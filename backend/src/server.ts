<<<<<<< HEAD
// backend/src/server.ts
=======
// src/server.ts
>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
import 'dotenv/config';
import app from './app';
import { connect } from './database/connection';

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindcare';

async function start() {
  try {
    await connect(MONGO_URI);
<<<<<<< HEAD
    // força bind na LAN tb
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Server ouvindo em http://192.168.18.20:${PORT}`)
=======
    app.listen(PORT, () =>
      console.log(`Server ouvindo em http://localhost:${PORT}`)
>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
    );
  } catch (e) {
    console.error('Falha ao iniciar', e);
    process.exit(1);
  }
}
<<<<<<< HEAD
=======

>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
start();
