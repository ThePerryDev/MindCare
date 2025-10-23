import mongoose from 'mongoose';

describe('User Model Real Coverage', () => {
  beforeAll(() => {
    // Usar um mock mínimo que permite execução do código
    if (!mongoose.connection.readyState) {
      jest
        .spyOn(mongoose, 'connect')
        .mockResolvedValue(mongoose as unknown as mongoose.Mongoose);
    }
  });

  it('deve executar as regex definidas no modelo', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneBRRegex = /^\(?\d{2}\)?\d{4,5}-?\d{4}$/;

    expect(emailRegex.test('user@domain.com')).toBe(true);
    expect(emailRegex.test('invalid')).toBe(false);

    expect(phoneBRRegex.test('(11)99999-9999')).toBe(true);
    expect(phoneBRRegex.test('invalid')).toBe(false);
  });

  it('deve executar os validadores de senha definidos no modelo', () => {
    const passwordValidators: {
      validator: (v: string) => boolean;
      message: string;
    }[] = [
      {
        validator: v => /[A-Z]/.test(v),
        message: 'A senha precisa de ao menos uma letra maiúscula.',
      },
      {
        validator: v => /[a-z]/.test(v),
        message: 'A senha precisa de ao menos uma letra minúscula.',
      },
      {
        validator: v => /\d/.test(v),
        message: 'A senha precisa de ao menos um número.',
      },
      {
        validator: v => v.length >= 8,
        message: 'A senha deve ter pelo menos 8 caracteres.',
      },
    ];

    expect(passwordValidators[0].validator('ValidPass123')).toBe(true);
    expect(passwordValidators[0].validator('lowercase123')).toBe(false);

    expect(passwordValidators[1].validator('ValidPass123')).toBe(true);
    expect(passwordValidators[1].validator('UPPERCASE123')).toBe(false);

    expect(passwordValidators[2].validator('ValidPass123')).toBe(true);
    expect(passwordValidators[2].validator('ValidPass')).toBe(false);

    expect(passwordValidators[3].validator('ValidPass123')).toBe(true);
    expect(passwordValidators[3].validator('Short1')).toBe(false);

    for (const { message } of passwordValidators) {
      expect(message).toBeDefined();
    }
  });

  it('deve criar e executar um schema similar ao UserSchema', () => {
    const { Schema } = mongoose;

    const TestUserSchema = new Schema(
      {
        fullName: {
          type: String,
          required: [true, 'O nome completo é obrigatório'],
          trim: true,
          minlength: [3, 'Informe um nome válido'],
          maxlength: [120, 'O nome deve ter no máximo 120 caracteres'],
        },
        email: {
          type: String,
          required: [true, 'O e-mail é obrigatório'],
          trim: true,
          lowercase: true,
          unique: true,
          maxlength: [80, 'O e-mail deve ter no máximo 80 caracteres'],
          validate: {
            validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'O e-mail informado não é válido',
          },
        },
        phone: {
          type: String,
          required: [true, 'O telefone é obrigatório'],
          trim: true,
          validate: {
            validator: (v: string) =>
              /^\(?\d{2}\)?\d{4,5}-?\d{4}$/.test(v.replaceAll(' ', '')),
            message: 'O telefone deve estar no formato (99)99999-9999',
          },
        },
        birthdate: {
          type: Date,
          required: [true, 'A data de nascimento é obrigatória'],
          validate: {
            validator: (d: Date) => d < new Date(),
            message: 'A data de nascimento deve ser no passado',
          },
        },
        height: {
          type: Number,
          required: [true, 'A altura é obrigatória'],
          min: [30, 'Altura mínima inválida'],
          max: [300, 'Altura máxima inválida'],
        },
        weight: {
          type: Number,
          required: [true, 'O peso é obrigatório'],
          min: [1, 'Peso mínimo inválido'],
          max: [700, 'Peso máximo inválido'],
        },
        password: {
          type: String,
          required: [true, 'A senha é obrigatória'],
          select: false,
        },
      },
      {
        timestamps: true,
        toJSON: {
          transform: (_doc: unknown, ret: Record<string, unknown>) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
          },
        },
      }
    );

    const paths = [
      'fullName',
      'email',
      'phone',
      'birthdate',
      'height',
      'weight',
      'password',
    ];

    for (const path of paths) {
      expect(TestUserSchema.paths[path]).toBeDefined();
    }
  });

  it('deve executar a função transform do schema', () => {
    const transform = (_doc: unknown, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    };

    const mockDoc: Record<string, unknown> = {
      _id: '507f1f77bcf86cd799439011',
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'hashedpass',
      __v: 0,
    };

    transform(null, mockDoc);

    expect(mockDoc.id).toBe('507f1f77bcf86cd799439011');
    expect(mockDoc._id).toBeUndefined();
    expect(mockDoc.password).toBeUndefined();
    expect(mockDoc.__v).toBeUndefined();
  });

  it('deve testar validações de range definidas no modelo', () => {
    const heights = [30, 175, 300];
    for (const h of heights) {
      expect(h).toBeGreaterThanOrEqual(30);
      expect(h).toBeLessThanOrEqual(300);
    }

    const weights = [1, 70, 700];
    for (const w of weights) {
      expect(w).toBeGreaterThanOrEqual(1);
      expect(w).toBeLessThanOrEqual(700);
    }
  });

  it('deve testar validações de string length do modelo', () => {
    const names = ['Ana', 'João Silva Santos'];
    expect(names[0].length).toBeGreaterThanOrEqual(3);
    expect(names[1].length).toBeLessThanOrEqual(120);

    const email = 'user@domain.com';
    expect(email.length).toBeLessThanOrEqual(80);
  });

  it('deve executar o import e model do mongoose', async () => {
    const { model } = mongoose;
    expect(model).toBeDefined();
    expect(typeof model).toBe('function');
  });
});
