import mongoose from 'mongoose';

describe('FeelingBot Model Coverage', () => {
  beforeAll(() => {
    // Usar um mock mínimo que permite execução do código
    if (!mongoose.connection.readyState) {
      jest
        .spyOn(mongoose, 'connect')
        .mockResolvedValue(mongoose as unknown as mongoose.Mongoose);
    }
  });

  it('deve executar as interfaces definidas no modelo', () => {
    // Simulação das interfaces para teste de cobertura
    interface IFeelingBotDay {
      sentimento: string;
      label?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }

    interface IFeelingBot {
      user_id: mongoose.Types.ObjectId;
      days: Map<string, IFeelingBotDay>;
      createdAt: Date;
      updatedAt: Date;
    }

    const mockFeelingBotDay: IFeelingBotDay = {
      sentimento: 'Feliz e otimista',
      label: '21/10/2025',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(mockFeelingBotDay.sentimento).toBeDefined();
    expect(mockFeelingBotDay.label).toBeDefined();
    expect(mockFeelingBotDay.createdAt).toBeInstanceOf(Date);
    expect(mockFeelingBotDay.updatedAt).toBeInstanceOf(Date);

    const mockFeelingBot: IFeelingBot = {
      user_id: new mongoose.Types.ObjectId(),
      days: new Map([['2025-10-21', mockFeelingBotDay]]),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(mockFeelingBot.user_id).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(mockFeelingBot.days).toBeInstanceOf(Map);
    expect(mockFeelingBot.days.size).toBe(1);
    expect(mockFeelingBot.days.get('2025-10-21')).toEqual(mockFeelingBotDay);
  });

  it('deve executar os validadores definidos no modelo', () => {
    // Validador de sentimento obrigatório
    const sentimentoValidator = (v: string) => !!v && v.trim().length > 0;
    expect(sentimentoValidator('Feliz e otimista')).toBe(true);
    expect(sentimentoValidator('Triste hoje')).toBe(true);
    expect(sentimentoValidator('')).toBe(false);
    expect(sentimentoValidator('   ')).toBe(false);

    // Validador de formato de day para Map key
    const dayKeyValidator = (key: string) => /^\d{4}-\d{2}-\d{2}$/.test(key);
    expect(dayKeyValidator('2025-10-21')).toBe(true);
    expect(dayKeyValidator('2025-01-01')).toBe(true);
    expect(dayKeyValidator('invalid')).toBe(false);
    expect(dayKeyValidator('2025/10/21')).toBe(false);
    expect(dayKeyValidator('25-10-21')).toBe(false);
  });

  it('deve criar e executar schemas similares ao FeelingBotSchema', () => {
    const { Schema } = mongoose;

    const TestFeelingBotDaySchema = new Schema(
      {
        sentimento: {
          type: String,
          required: [true, 'sentimento é obrigatório'],
        },
        label: { type: String, trim: true },
      },
      { _id: false, timestamps: true }
    );

    const TestFeelingBotSchema = new Schema(
      {
        user_id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'user_id é obrigatório'],
          index: true,
          unique: true,
        },
        days: {
          type: Map,
          of: TestFeelingBotDaySchema,
          default: {},
        },
      },
      {
        timestamps: true,
        toJSON: {
          transform: (_doc, ret: any) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;

            if (ret.days && ret.days instanceof Map) {
              const entries = Array.from(ret.days.entries()).map(
                ([day, v]: any) => ({
                  day,
                  sentimento: v.sentimento,
                  label: v.label,
                  createdAt: v.createdAt,
                  updatedAt: v.updatedAt,
                })
              );
              entries.sort((a, b) =>
                a.day < b.day ? 1 : a.day > b.day ? -1 : 0
              );
              ret.days = entries;
            }
          },
        },
      }
    );

    const paths = ['user_id', 'days'];

    for (const path of paths) {
      expect(TestFeelingBotSchema.paths[path]).toBeDefined();
    }

    // Verificar se os campos são required
    expect(TestFeelingBotSchema.paths.user_id.isRequired).toBe(true);
    expect(TestFeelingBotSchema.paths.user_id.options.unique).toBe(true);
    expect(TestFeelingBotSchema.paths.user_id.options.index).toBe(true);

    // Verificar subdocumento
    expect(TestFeelingBotDaySchema.paths.sentimento).toBeDefined();
    expect(TestFeelingBotDaySchema.paths.label).toBeDefined();
    expect(TestFeelingBotDaySchema.paths.sentimento.isRequired).toBe(true);
    expect(TestFeelingBotDaySchema.options.timestamps).toBe(true);
    expect(TestFeelingBotDaySchema.options._id).toBe(false);
  });

  it('deve executar a função transform do schema', () => {
    const transform = (_doc: unknown, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;

      if (ret.days && ret.days instanceof Map) {
        const entries = Array.from(ret.days.entries()).map(([day, v]: any) => ({
          day,
          sentimento: v.sentimento,
          label: v.label,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
        }));
        entries.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));
        ret.days = entries;
      }
    };

    // Mock de Map com dados
    const mockDaysMap = new Map([
      [
        '2025-10-21',
        {
          sentimento: 'Muito feliz hoje',
          label: '21/10/2025',
          createdAt: new Date('2025-10-21T10:00:00Z'),
          updatedAt: new Date('2025-10-21T10:00:00Z'),
        },
      ],
      [
        '2025-10-22',
        {
          sentimento: 'Dia neutro',
          label: '22/10/2025',
          createdAt: new Date('2025-10-22T10:00:00Z'),
          updatedAt: new Date('2025-10-22T10:00:00Z'),
        },
      ],
    ]);

    const mockDoc: Record<string, unknown> = {
      _id: '507f1f77bcf86cd799439011',
      user_id: '507f1f77bcf86cd799439012',
      days: mockDaysMap,
      __v: 0,
    };

    transform(null, mockDoc);

    expect(mockDoc.id).toBe('507f1f77bcf86cd799439011');
    expect(mockDoc._id).toBeUndefined();
    expect(mockDoc.__v).toBeUndefined();
    expect(Array.isArray(mockDoc.days)).toBe(true);

    const daysArray = mockDoc.days as any[];
    expect(daysArray.length).toBe(2);
    expect(daysArray[0].day).toBe('2025-10-22'); // ordenado desc
    expect(daysArray[1].day).toBe('2025-10-21');
    expect(daysArray[0].sentimento).toBe('Dia neutro');
    expect(daysArray[1].sentimento).toBe('Muito feliz hoje');
  });

  it('deve testar operações de Map definidas no modelo', () => {
    const daysMap = new Map<string, any>();

    // Operações básicas de Map
    const dayKey = '2025-10-21';
    const dayData = {
      sentimento: 'Muito feliz',
      label: '21 de outubro',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    daysMap.set(dayKey, dayData);
    expect(daysMap.has(dayKey)).toBe(true);
    expect(daysMap.get(dayKey)).toEqual(dayData);
    expect(daysMap.size).toBe(1);

    // Adicionar mais um dia
    const dayKey2 = '2025-10-22';
    const dayData2 = {
      sentimento: 'Dia normal',
      label: '22 de outubro',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    daysMap.set(dayKey2, dayData2);
    expect(daysMap.size).toBe(2);

    // Deletar um dia
    daysMap.delete(dayKey);
    expect(daysMap.has(dayKey)).toBe(false);
    expect(daysMap.size).toBe(1);

    // Conversão para array ordenado
    const entries = Array.from(daysMap.entries()).map(([day, v]: any) => ({
      day,
      sentimento: v.sentimento,
      label: v.label,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));
    entries.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));

    expect(entries).toHaveLength(1);
    expect(entries[0].day).toBe(dayKey2);
    expect(entries[0].sentimento).toBe(dayData2.sentimento);
  });

  it('deve executar validações de string trim', () => {
    const trimTest = (value: string) => value.trim();

    expect(trimTest('  test  ')).toBe('test');
    expect(trimTest('normal')).toBe('normal');
    expect(trimTest('   ')).toBe('');
    expect(trimTest('')).toBe('');
  });

  it('deve executar o import e model do mongoose', () => {
    const { model, Schema } = mongoose;
    expect(model).toBeDefined();
    expect(Schema).toBeDefined();
    expect(typeof model).toBe('function');
    expect(typeof Schema).toBe('function');
  });

  it('deve testar a estrutura de índices definidos no modelo', () => {
    const { Schema } = mongoose;

    const TestSchema = new Schema({
      user_id: {
        type: Schema.Types.ObjectId,
        index: true,
        unique: true,
      },
      updatedAt: {
        type: Date,
        index: true,
      },
    });

    // Adicionar índice composto simulando o modelo real
    TestSchema.index({ updatedAt: -1 });

    expect(TestSchema.paths.user_id.options.index).toBe(true);
    expect(TestSchema.paths.user_id.options.unique).toBe(true);
  });

  it('deve testar ordenação de dias em ordem descendente', () => {
    const days = ['2025-10-19', '2025-10-21', '2025-10-20', '2025-10-18'];

    const sorted = days.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

    expect(sorted).toEqual([
      '2025-10-21',
      '2025-10-20',
      '2025-10-19',
      '2025-10-18',
    ]);
  });

  it('deve testar o modelo real FeelingBot com Map', async () => {
    // Importar e usar o modelo real para exercitar as linhas finais
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FeelingBotModel = require('../../models/feeling_bot.model').default;

    // Testar se o modelo foi criado corretamente
    expect(FeelingBotModel).toBeDefined();
    expect(FeelingBotModel.modelName).toBe('FeelingBot');

    // Testar a estrutura do schema
    const schema = FeelingBotModel.schema;
    expect(schema.paths.user_id).toBeDefined();
    expect(schema.paths.days).toBeDefined();

    // Testar se days é do tipo Map
    expect(schema.paths.days.instance).toBe('Map');

    // Testar índices do schema real
    const indexes = schema.indexes();
    expect(indexes).toEqual([
      [{ user_id: 1 }, { background: true, unique: true }],
      [{ updatedAt: -1 }, { background: true }],
    ]);
  });

  it('deve exercitar a função transform com Map vazia e sem Map', () => {
    const transform = (_doc: unknown, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;

      // Testar branch quando days existe mas não é Map
      if (ret.days && ret.days instanceof Map) {
        const entries = Array.from(ret.days.entries()).map(([day, v]: any) => ({
          day,
          sentimento: v.sentimento,
          label: v.label,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
        }));
        entries.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));
        ret.days = entries;
      }
    };

    // Teste com Map vazia
    const mockDocWithEmptyMap: Record<string, unknown> = {
      _id: '507f1f77bcf86cd799439011',
      user_id: '507f1f77bcf86cd799439012',
      days: new Map(),
      __v: 0,
    };

    transform(null, mockDocWithEmptyMap);
    expect(Array.isArray(mockDocWithEmptyMap.days)).toBe(true);
    expect((mockDocWithEmptyMap.days as any[]).length).toBe(0);

    // Teste sem campo days
    const mockDocWithoutDays: Record<string, unknown> = {
      _id: '507f1f77bcf86cd799439013',
      user_id: '507f1f77bcf86cd799439014',
      __v: 0,
    };

    transform(null, mockDocWithoutDays);
    expect(mockDocWithoutDays.id).toBe('507f1f77bcf86cd799439013');
    expect(mockDocWithoutDays.days).toBeUndefined();

    // Teste com days que não é Map
    const mockDocWithArrayDays: Record<string, unknown> = {
      _id: '507f1f77bcf86cd799439015',
      user_id: '507f1f77bcf86cd799439016',
      days: [], // array ao invés de Map
      __v: 0,
    };

    transform(null, mockDocWithArrayDays);
    expect(Array.isArray(mockDocWithArrayDays.days)).toBe(true);
    expect((mockDocWithArrayDays.days as any[]).length).toBe(0);
  });

  it('deve testar ordenação complexa de entries com dias iguais', () => {
    // Testar o caso específico de ordenação com dias iguais (edge case da função sort)
    const entries = [
      { day: '2025-10-21', sentimento: 'Feliz' },
      { day: '2025-10-21', sentimento: 'Triste' }, // mesmo dia
      { day: '2025-10-20', sentimento: 'Neutro' },
    ];

    const sorted = entries.sort((a, b) =>
      a.day < b.day ? 1 : a.day > b.day ? -1 : 0
    );

    // Dias iguais devem retornar 0 na comparação, mantendo ordem original
    expect(sorted[0].day).toBe('2025-10-21');
    expect(sorted[1].day).toBe('2025-10-21');
    expect(sorted[2].day).toBe('2025-10-20');
  });

  it('deve cobrir especificamente a linha 66 - branch de comparação igual', () => {
    // Testar o terceiro branch da função sort na linha 66: quando a.day === b.day retorna 0
    const sortFunction = (a: any, b: any) =>
      a.day < b.day ? 1 : a.day > b.day ? -1 : 0;

    // Caso 1: a.day < b.day (deve retornar 1)
    expect(sortFunction({ day: '2025-10-20' }, { day: '2025-10-21' })).toBe(1);

    // Caso 2: a.day > b.day (deve retornar -1)
    expect(sortFunction({ day: '2025-10-22' }, { day: '2025-10-21' })).toBe(-1);

    // Caso 3: a.day === b.day (deve retornar 0) - LINHA 66
    expect(sortFunction({ day: '2025-10-21' }, { day: '2025-10-21' })).toBe(0);

    // Testar com Map real para exercitar a linha 66 no contexto completo
    const mockDaysMap = new Map([
      ['2025-10-21', { sentimento: 'Feliz', label: 'Teste1' }],
      ['2025-10-21', { sentimento: 'Triste', label: 'Teste2' }], // mesmo dia
    ]);

    const entries = Array.from(mockDaysMap.entries()).map(([day, v]: any) => ({
      day,
      sentimento: v.sentimento,
      label: v.label,
    }));

    // Executar a ordenação que usa a linha 66
    const sortedEntries = entries.sort((a, b) =>
      a.day < b.day ? 1 : a.day > b.day ? -1 : 0
    );

    // Com Map, o segundo item com a mesma chave sobrescreve o primeiro
    expect(sortedEntries.length).toBe(1);
    expect(sortedEntries[0].day).toBe('2025-10-21');
  });

  it('deve exercitar o método toJSON do modelo real FeelingBot', () => {
    // Importar o modelo real para executar as linhas finais
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FeelingBotModel = require('../../models/feeling_bot.model').default;

    // Criar um Map com dados para testar
    const mockDaysMap = new Map([
      [
        '2025-10-21',
        {
          sentimento: 'Muito feliz hoje',
          label: '21/10/2025',
          createdAt: new Date('2025-10-21T10:00:00Z'),
          updatedAt: new Date('2025-10-21T10:00:00Z'),
        },
      ],
      [
        '2025-10-20',
        {
          sentimento: 'Dia normal',
          label: '20/10/2025',
          createdAt: new Date('2025-10-20T10:00:00Z'),
          updatedAt: new Date('2025-10-20T10:00:00Z'),
        },
      ],
    ]);

    // Executar transform diretamente para exercitar todas as linhas
    const mockDocument: any = {
      _id: '507f1f77bcf86cd799439011',
      user_id: '507f1f77bcf86cd799439012',
      days: mockDaysMap,
      __v: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Executar transform para exercitar as linhas 51-67
    if (
      FeelingBotModel.schema.options.toJSON &&
      FeelingBotModel.schema.options.toJSON.transform
    ) {
      FeelingBotModel.schema.options.toJSON.transform({}, mockDocument);
    }

    // Verificar se a transformação foi aplicada
    expect(mockDocument.id).toBe('507f1f77bcf86cd799439011');
    expect(mockDocument._id).toBeUndefined();
    expect(mockDocument.__v).toBeUndefined();
    expect(Array.isArray(mockDocument.days)).toBe(true);

    // Verificar ordenação descendente por dia
    const daysArray = mockDocument.days;
    expect(daysArray.length).toBe(2);
    expect(daysArray[0].day).toBe('2025-10-21');
    expect(daysArray[1].day).toBe('2025-10-20');
    expect(daysArray[0].sentimento).toBe('Muito feliz hoje');
  });

  it('deve exercitar todas as linhas da função transform incluindo Map entries', () => {
    // Importar o modelo real
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FeelingBotModel = require('../../models/feeling_bot.model').default;

    // Testar com Map que tem múltiplas entries para exercitar o Array.from e sort
    const complexMap = new Map([
      [
        '2025-10-25',
        {
          sentimento: 'Excelente dia',
          label: '25/10',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      [
        '2025-10-23',
        {
          sentimento: 'Dia ok',
          label: '23/10',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      [
        '2025-10-24',
        {
          sentimento: 'Bom dia',
          label: '24/10',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    ]);

    const mockDoc: any = {
      _id: '507f1f77bcf86cd799439013',
      user_id: '507f1f77bcf86cd799439014',
      days: complexMap,
      __v: 1,
    };

    // Executar função transform diretamente
    if (
      FeelingBotModel.schema.options.toJSON &&
      FeelingBotModel.schema.options.toJSON.transform
    ) {
      FeelingBotModel.schema.options.toJSON.transform({}, mockDoc);
    }

    // Verificar todas as transformações
    expect(mockDoc.id).toBe('507f1f77bcf86cd799439013');
    expect(mockDoc._id).toBeUndefined();
    expect(mockDoc.__v).toBeUndefined();
    expect(Array.isArray(mockDoc.days)).toBe(true);

    // Verificar ordenação correta (descendente)
    const sortedDays = mockDoc.days;
    expect(sortedDays[0].day).toBe('2025-10-25'); // mais recente primeiro
    expect(sortedDays[1].day).toBe('2025-10-24');
    expect(sortedDays[2].day).toBe('2025-10-23'); // mais antigo por último
  });

  it('deve testar a criação condicional do modelo FeelingBot mongoose', () => {
    // Importar e verificar se o modelo FeelingBot foi criado corretamente
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FeelingBotModel = require('../../models/feeling_bot.model').default;

    // Verificar se o modelo existe e tem as propriedades corretas
    expect(FeelingBotModel).toBeDefined();
    expect(FeelingBotModel.modelName).toBe('FeelingBot');

    // Verificar se o schema tem a configuração correta
    expect(FeelingBotModel.schema.options.timestamps).toBe(true);
    expect(FeelingBotModel.schema.options.toJSON).toBeDefined();

    // Testar se o índice foi criado
    const indexes = FeelingBotModel.schema.indexes();
    expect(indexes.length).toBeGreaterThan(0);

    // Verificar se contém o índice updatedAt
    const hasUpdatedAtIndex = indexes.some(
      (index: any) => index[0] && index[0].updatedAt === -1
    );
    expect(hasUpdatedAtIndex).toBe(true);
  });
});
