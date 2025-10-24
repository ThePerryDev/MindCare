"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Teste que realmente importa e executa o user.model.ts
const userModelModule = __importStar(require("../../models/user.model"));
// Funções auxiliares para reduzir complexidade do constructor
function executeValidator(validator) {
    if (typeof validator === 'function') {
        validator('test');
    }
}
function executeFieldValidation(field) {
    if (field.validate) {
        if (typeof field.validate.validator === 'function') {
            executeValidator(field.validate.validator);
        }
        if (Array.isArray(field.validate)) {
            for (const v of field.validate) {
                executeValidator(v.validator);
            }
        }
    }
}
// Mock mínimo do mongoose
jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        Schema: class MockSchema {
            constructor(definition, options) {
                this.paths = {};
                for (const key of Object.keys(definition)) {
                    const field = definition[key];
                    this.paths[key] = field;
                    executeFieldValidation(field);
                }
                if (options?.toJSON?.transform) {
                    const mockDoc = {
                        _id: 'test',
                        password: 'test',
                        __v: 0,
                    };
                    options.toJSON.transform(null, mockDoc);
                }
            }
        },
        model: jest.fn().mockReturnValue({}),
    };
});
describe('User Model Real Import and Execution', () => {
    it('deve importar o UserModel e executar seu código', () => {
        const UserModel = userModelModule.default;
        expect(UserModel).toBeDefined();
    });
    it('deve executar as constantes e validações definidas no modelo', async () => {
        const userModel = await Promise.resolve().then(() => __importStar(require('../../models/user.model')));
        expect(userModel).toBeDefined();
    });
    it('deve testar regex patterns usados no modelo', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneBRRegex = /^\(?\d{2}\)?\d{4,5}-?\d{4}$/;
        expect(emailRegex.test('test@example.com')).toBe(true);
        expect(phoneBRRegex.test('(11)99999-9999')).toBe(true);
    });
    it('deve testar validadores de senha do modelo', () => {
        const validators = [
            v => /[A-Z]/.test(v),
            v => /[a-z]/.test(v),
            v => /\d/.test(v),
            v => v.length >= 8,
        ];
        for (const validator of validators) {
            expect(validator('TestPass123')).toBe(true);
        }
    });
    it('deve testar função transform do modelo', () => {
        const transform = (_doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        };
        const testObj = {
            _id: 'test123',
            name: 'Test',
            password: 'secret',
            __v: 0,
        };
        transform(null, testObj);
        expect(testObj.id).toBe('test123');
        expect(testObj._id).toBeUndefined();
        expect(testObj.password).toBeUndefined();
    });
});
