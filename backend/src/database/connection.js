"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
// src/database/connection.ts
const mongoose_1 = __importDefault(require("mongoose"));
async function connect(uri) {
    // Event handlers úteis para observabilidade
    mongoose_1.default.connection.on('connected', () => console.log('[mongo] connected'));
    mongoose_1.default.connection.on('open', () => console.log('[mongo] open'));
    mongoose_1.default.connection.on('disconnected', () => console.log('[mongo] disconnected'));
    mongoose_1.default.connection.on('reconnected', () => console.log('[mongo] reconnected'));
    mongoose_1.default.connection.on('disconnecting', () => console.log('[mongo] disconnecting'));
    mongoose_1.default.connection.on('close', () => console.log('[mongo] close'));
    mongoose_1.default.connection.on('error', e => console.error('[mongo] error', e));
    await mongoose_1.default.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
    });
    console.log('[mongo] Conectado ao MongoDB');
    // Encerramento gracioso
    process.on('SIGINT', async () => {
        try {
            await mongoose_1.default.connection.close();
            console.log('[mongo] conexão fechada (SIGINT)');
            process.exit(0);
        }
        catch (error) {
            console.error('[mongo] erro ao fechar conexão', error);
            process.exit(1);
        }
    });
}
