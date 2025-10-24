"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const connection_1 = require("./database/connection");
const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindcare';
async function start() {
    try {
        await (0, connection_1.connect)(MONGO_URI);
        app_1.default.listen(PORT, () => console.log(`Server ouvindo em http://localhost:${PORT}`));
    }
    catch (e) {
        console.error('Falha ao iniciar', e);
        process.exit(1);
    }
}
start();
