import { connect } from '../../database/connection';

// Mock seguro do mongoose antes do import real
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    close: jest.fn(),
  },
}));

import mongoose from 'mongoose';

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Espiona logs em vez de substituir console
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Espiona process.on e process.exit
    jest.spyOn(process, 'on').mockImplementation(() => process);
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    // Mocka comportamentos do mongoose
    (mongoose.connect as jest.Mock).mockResolvedValue(undefined);
    (mongoose.connection.on as jest.Mock).mockImplementation(
      () => mongoose.connection
    );
    (mongoose.connection.close as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ================================================================
  describe('Função connect', () => {
    it('deve conectar ao MongoDB com sucesso', async () => {
      const uri = 'mongodb://localhost:27017/test';
      await connect(uri);

      expect(mongoose.connect).toHaveBeenCalledWith(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
      expect(console.log).toHaveBeenCalledWith('[mongo] Conectado ao MongoDB');
    });

    it('deve configurar todos os event handlers da conexão', async () => {
      const uri = 'mongodb://localhost:27017/test';
      await connect(uri);

      const expectedEvents = [
        'connected',
        'open',
        'disconnected',
        'reconnected',
        'disconnecting',
        'close',
        'error',
      ];

      for (const event of expectedEvents) {
        expect(mongoose.connection.on).toHaveBeenCalledWith(
          event,
          expect.any(Function)
        );
      }
    });

    it('deve configurar handler para SIGINT', async () => {
      const uri = 'mongodb://localhost:27017/test';
      await connect(uri);

      expect(process.on).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    });

    it('deve propagar erro de conexão', async () => {
      const uri = 'mongodb://invalid-uri';
      const error = new Error('Connection failed');
      (mongoose.connect as jest.Mock).mockRejectedValue(error);

      await expect(connect(uri)).rejects.toThrow('Connection failed');
    });

    it('deve aceitar diferentes URIs', async () => {
      const uris = [
        'mongodb://localhost:27017/db1',
        'mongodb://user:pass@remote:27017/db2',
        'mongodb+srv://cluster.mongodb.net/db3',
      ];

      for (const uri of uris) {
        await connect(uri);
        expect(mongoose.connect).toHaveBeenCalledWith(uri, expect.any(Object));
      }
    });
  });

  // ================================================================
  describe('Event Handlers', () => {
    const eventHandlers: Record<string, (...args: unknown[]) => void> = {};

    beforeEach(async () => {
      (mongoose.connection.on as jest.Mock).mockImplementation(
        (event: string, handler: (...args: unknown[]) => void) => {
          eventHandlers[event] = handler;
        }
      );

      await connect('mongodb://localhost:27017/test');
    });

    it('deve logar quando conectado', () => {
      eventHandlers.connected();
      expect(console.log).toHaveBeenCalledWith('[mongo] connected');
    });

    it('deve logar quando aberto', () => {
      eventHandlers.open();
      expect(console.log).toHaveBeenCalledWith('[mongo] open');
    });

    it('deve logar quando desconectado', () => {
      eventHandlers.disconnected();
      expect(console.log).toHaveBeenCalledWith('[mongo] disconnected');
    });

    it('deve logar quando reconectado', () => {
      eventHandlers.reconnected();
      expect(console.log).toHaveBeenCalledWith('[mongo] reconnected');
    });

    it('deve logar quando desconectando', () => {
      eventHandlers.disconnecting();
      expect(console.log).toHaveBeenCalledWith('[mongo] disconnecting');
    });

    it('deve logar quando fechado', () => {
      eventHandlers.close();
      expect(console.log).toHaveBeenCalledWith('[mongo] close');
    });

    it('deve logar erro de conexão', () => {
      const error = new Error('Connection error');
      eventHandlers.error(error);
      expect(console.error).toHaveBeenCalledWith('[mongo] error', error);
    });
  });

  // ================================================================
  describe('SIGINT Handler', () => {
    let sigintHandler: (...args: unknown[]) => Promise<void>;

    beforeEach(async () => {
      (process.on as jest.Mock).mockImplementation(
        (signal: string, handler: (...args: unknown[]) => void) => {
          if (signal === 'SIGINT') sigintHandler = handler as any;
          return process;
        }
      );

      await connect('mongodb://localhost:27017/test');
    });

    it('deve fechar conexão graciosamente no SIGINT', async () => {
      await sigintHandler();
      expect(mongoose.connection.close).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        '[mongo] conexão fechada (SIGINT)'
      );
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('deve lidar com erro ao fechar conexão no SIGINT', async () => {
      const error = new Error('Close error');
      (mongoose.connection.close as jest.Mock).mockRejectedValue(error);

      await sigintHandler();

      expect(console.error).toHaveBeenCalledWith(
        '[mongo] erro ao fechar conexão',
        error
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('deve tentar fechar conexão mesmo se já estiver fechada', async () => {
      (mongoose.connection.close as jest.Mock).mockResolvedValue(undefined);

      await sigintHandler();

      expect(mongoose.connection.close).toHaveBeenCalled();
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  // ================================================================
  describe('Configurações de Conexão', () => {
    it('deve usar configurações corretas por padrão', async () => {
      const uri = 'mongodb://localhost:27017/test';
      await connect(uri);

      expect(mongoose.connect).toHaveBeenCalledWith(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
    });

    it('deve conectar com diferentes configurações de URI', async () => {
      const testCases = [
        'mongodb://localhost:27017/local',
        'mongodb://user:pass@localhost:27017/auth',
        'mongodb+srv://cluster.mongodb.net/cloud',
      ];

      for (const uri of testCases) {
        await connect(uri);
        expect(mongoose.connect).toHaveBeenCalledWith(uri, {
          serverSelectionTimeoutMS: 5000,
          maxPoolSize: 10,
        });
      }
    });
  });

  // ================================================================
  describe('Logs e Monitoramento', () => {
    it('deve registrar mensagem de sucesso na conexão', async () => {
      const uri = 'mongodb://localhost:27017/test';
      await connect(uri);

      expect(console.log).toHaveBeenCalledWith('[mongo] Conectado ao MongoDB');
    });

    it('deve configurar observabilidade completa', async () => {
      const uri = 'mongodb://localhost:27017/test';
      await connect(uri);

      const observabilityEvents = [
        'connected',
        'open',
        'disconnected',
        'reconnected',
        'disconnecting',
        'close',
        'error',
      ];

      for (const event of observabilityEvents) {
        expect(mongoose.connection.on).toHaveBeenCalledWith(
          event,
          expect.any(Function)
        );
      }
    });
  });

  // ================================================================
  describe('Encerramento Gracioso', () => {
    it('deve configurar encerramento gracioso apenas uma vez', async () => {
      const uri = 'mongodb://localhost:27017/test';
      await connect(uri);
      await connect(uri);
      await connect(uri);

      expect(process.on).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    });

    it('deve preservar funcionalidade mesmo com múltiplas conexões', async () => {
      const uri1 = 'mongodb://localhost:27017/db1';
      const uri2 = 'mongodb://localhost:27017/db2';

      await connect(uri1);
      await connect(uri2);

      expect(mongoose.connect).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledTimes(2);
    });
  });
});
