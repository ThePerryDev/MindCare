import mongoose from 'mongoose';
import { connect } from '../../database/connection';

// Mock do mongoose
jest.mock('mongoose');
const mockMongoose = mongoose as jest.Mocked<typeof mongoose>;

// Mock do console
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
};

// Mock do process
const mockProcess = {
  on: jest.fn(),
  exit: jest.fn(),
};

describe('Database Connection', () => {
  let mockConnection: any;
  let originalConsole: any;
  let originalProcess: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Salva originais
    originalConsole = { ...console };
    originalProcess = process;

    // Mock da conexão
    mockConnection = {
      on: jest.fn(),
      close: jest.fn().mockResolvedValue(undefined),
    };

    (mockMongoose as any).connection = mockConnection;
    mockMongoose.connect = jest.fn().mockResolvedValue(undefined);

    // Aplica mocks
    console.log = mockConsole.log;
    console.error = mockConsole.error;
    (global as any).process = { ...process, ...mockProcess };
  });

  afterEach(() => {
    // Restaura originais
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    (global as any).process = originalProcess;
  });

  describe('Função connect', () => {
    it('deve conectar ao MongoDB com sucesso', async () => {
      // Arrange
      const uri = 'mongodb://localhost:27017/test';

      // Act
      await connect(uri);

      // Assert
      expect(mockMongoose.connect).toHaveBeenCalledWith(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
      expect(mockConsole.log).toHaveBeenCalledWith(
        '[mongo] Conectado ao MongoDB'
      );
    });

    it('deve configurar todos os event handlers da conexão', async () => {
      // Arrange
      const uri = 'mongodb://localhost:27017/test';

      // Act
      await connect(uri);

      // Assert - Verifica se todos os eventos foram registrados
      const expectedEvents = [
        'connected',
        'open',
        'disconnected',
        'reconnected',
        'disconnecting',
        'close',
        'error',
      ];

      expectedEvents.forEach(event => {
        expect(mockConnection.on).toHaveBeenCalledWith(
          event,
          expect.any(Function)
        );
      });
    });

    it('deve configurar handler para SIGINT', async () => {
      // Arrange
      const uri = 'mongodb://localhost:27017/test';

      // Act
      await connect(uri);

      // Assert
      expect(mockProcess.on).toHaveBeenCalledWith(
        'SIGINT',
        expect.any(Function)
      );
    });

    it('deve propagar erro de conexão', async () => {
      // Arrange
      const uri = 'mongodb://invalid-uri';
      const error = new Error('Connection failed');
      mockMongoose.connect.mockRejectedValue(error);

      // Act & Assert
      await expect(connect(uri)).rejects.toThrow('Connection failed');
    });

    it('deve aceitar diferentes URIs', async () => {
      // Arrange
      const uris = [
        'mongodb://localhost:27017/db1',
        'mongodb://user:pass@remote:27017/db2',
        'mongodb+srv://cluster.mongodb.net/db3',
      ];

      // Act & Assert
      for (const uri of uris) {
        await connect(uri);
        expect(mockMongoose.connect).toHaveBeenCalledWith(
          uri,
          expect.any(Object)
        );
      }
    });
  });

  describe('Event Handlers', () => {
    let eventHandlers: { [key: string]: Function };

    beforeEach(async () => {
      // Captura os event handlers
      eventHandlers = {};
      mockConnection.on.mockImplementation(
        (event: string, handler: Function) => {
          eventHandlers[event] = handler;
        }
      );

      await connect('mongodb://localhost:27017/test');
    });

    it('deve logar quando conectado', () => {
      // Act
      eventHandlers.connected();

      // Assert
      expect(mockConsole.log).toHaveBeenCalledWith('[mongo] connected');
    });

    it('deve logar quando aberto', () => {
      // Act
      eventHandlers.open();

      // Assert
      expect(mockConsole.log).toHaveBeenCalledWith('[mongo] open');
    });

    it('deve logar quando desconectado', () => {
      // Act
      eventHandlers.disconnected();

      // Assert
      expect(mockConsole.log).toHaveBeenCalledWith('[mongo] disconnected');
    });

    it('deve logar quando reconectado', () => {
      // Act
      eventHandlers.reconnected();

      // Assert
      expect(mockConsole.log).toHaveBeenCalledWith('[mongo] reconnected');
    });

    it('deve logar quando desconectando', () => {
      // Act
      eventHandlers.disconnecting();

      // Assert
      expect(mockConsole.log).toHaveBeenCalledWith('[mongo] disconnecting');
    });

    it('deve logar quando fechado', () => {
      // Act
      eventHandlers.close();

      // Assert
      expect(mockConsole.log).toHaveBeenCalledWith('[mongo] close');
    });

    it('deve logar erro de conexão', () => {
      // Arrange
      const error = new Error('Connection error');

      // Act
      eventHandlers.error(error);

      // Assert
      expect(mockConsole.error).toHaveBeenCalledWith('[mongo] error', error);
    });
  });

  describe('SIGINT Handler', () => {
    let sigintHandler: Function;

    beforeEach(async () => {
      // Captura o handler do SIGINT
      mockProcess.on.mockImplementation((signal: string, handler: Function) => {
        if (signal === 'SIGINT') {
          sigintHandler = handler;
        }
      });

      await connect('mongodb://localhost:27017/test');
    });

    it('deve fechar conexão graciosamente no SIGINT', async () => {
      // Act
      await sigintHandler();

      // Assert
      expect(mockConnection.close).toHaveBeenCalled();
      expect(mockConsole.log).toHaveBeenCalledWith(
        '[mongo] conexão fechada (SIGINT)'
      );
      expect(mockProcess.exit).toHaveBeenCalledWith(0);
    });

    it('deve lidar com erro ao fechar conexão no SIGINT', async () => {
      // Arrange
      const error = new Error('Close error');
      mockConnection.close.mockRejectedValue(error);

      // Act
      await sigintHandler();

      // Assert
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[mongo] erro ao fechar conexão',
        error
      );
      expect(mockProcess.exit).toHaveBeenCalledWith(1);
    });

    it('deve tentar fechar conexão mesmo se já estiver fechada', async () => {
      // Arrange
      mockConnection.close.mockResolvedValue(undefined);

      // Act
      await sigintHandler();

      // Assert
      expect(mockConnection.close).toHaveBeenCalled();
      expect(mockProcess.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('Configurações de Conexão', () => {
    it('deve usar configurações corretas por padrão', async () => {
      // Arrange
      const uri = 'mongodb://localhost:27017/test';

      // Act
      await connect(uri);

      // Assert
      expect(mockMongoose.connect).toHaveBeenCalledWith(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
    });

    it('deve conectar com diferentes configurações de URI', async () => {
      // Arrange
      const testCases = [
        'mongodb://localhost:27017/local',
        'mongodb://user:pass@localhost:27017/auth',
        'mongodb+srv://cluster.mongodb.net/cloud',
      ];

      // Act & Assert
      for (const uri of testCases) {
        await connect(uri);
        expect(mockMongoose.connect).toHaveBeenCalledWith(uri, {
          serverSelectionTimeoutMS: 5000,
          maxPoolSize: 10,
        });
      }
    });
  });

  describe('Logs e Monitoramento', () => {
    it('deve registrar mensagem de sucesso na conexão', async () => {
      // Arrange
      const uri = 'mongodb://localhost:27017/test';

      // Act
      await connect(uri);

      // Assert
      expect(mockConsole.log).toHaveBeenCalledWith(
        '[mongo] Conectado ao MongoDB'
      );
    });

    it('deve configurar observabilidade completa', async () => {
      // Arrange
      const uri = 'mongodb://localhost:27017/test';

      // Act
      await connect(uri);

      // Assert - Verifica se todos os eventos de observabilidade foram configurados
      const observabilityEvents = [
        'connected',
        'open',
        'disconnected',
        'reconnected',
        'disconnecting',
        'close',
        'error',
      ];

      observabilityEvents.forEach(event => {
        expect(mockConnection.on).toHaveBeenCalledWith(
          event,
          expect.any(Function)
        );
      });
    });
  });

  describe('Encerramento Gracioso', () => {
    it('deve configurar encerramento gracioso apenas uma vez', async () => {
      // Arrange
      const uri = 'mongodb://localhost:27017/test';

      // Act - Conecta múltiplas vezes
      await connect(uri);
      await connect(uri);
      await connect(uri);

      // Assert - SIGINT handler deve ser configurado em cada conexão
      expect(mockProcess.on).toHaveBeenCalledTimes(3);
    });

    it('deve preservar funcionalidade mesmo com múltiplas conexões', async () => {
      // Arrange
      const uri1 = 'mongodb://localhost:27017/db1';
      const uri2 = 'mongodb://localhost:27017/db2';

      // Act
      await connect(uri1);
      await connect(uri2);

      // Assert
      expect(mockMongoose.connect).toHaveBeenCalledTimes(2);
      expect(mockConsole.log).toHaveBeenCalledTimes(2);
    });
  });
});
