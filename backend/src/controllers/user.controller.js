"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
class UsersController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { fullName, email, phone, birthdate, height, weight, password, confirmPassword, } = req.body;
                if (password !== confirmPassword) {
                    res.status(400).json({ message: 'As senhas não coincidem.' });
                    return;
                }
                const hashed = await bcrypt_1.default.hash(password, 10);
                const user = new user_model_1.default({
                    fullName,
                    email,
                    phone,
                    birthdate,
                    height,
                    weight,
                    password: hashed,
                });
                const saved = await user.save();
                res.status(201).json(saved);
            }
            catch (e) {
                if (e.code === 11000) {
                    res.status(400).json({ message: 'E-mail já está em uso.' });
                }
                else if (e.errors) {
                    const messages = Object.values(e.errors).map((err) => err.message);
                    res.status(400).json({ message: messages });
                }
                else {
                    res
                        .status(500)
                        .json({ message: e.message || 'Erro interno do servidor' });
                }
            }
        };
        this.updateMetrics = async (req, res) => {
            try {
                const { id } = req.params;
                const { height, weight, birthdate, fullName, phone } = req.body;
                const user = await user_model_1.default.findById(id);
                if (!user) {
                    res.status(404).json({ message: 'Usuário não encontrado' });
                    return;
                }
                if (typeof height === 'number')
                    user.height = height;
                if (typeof weight === 'number')
                    user.weight = weight;
                if (birthdate)
                    user.birthdate = new Date(birthdate);
                if (fullName)
                    user.fullName = fullName;
                if (phone)
                    user.phone = phone;
                await user.save();
                res.status(200).json(user.toJSON());
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: 'Erro ao atualizar os dados.', error: error.message });
            }
        };
    }
    async getUserDataById(req, res) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ message: 'O ID do usuário é necessário.' });
        try {
            const projection = req.query.fields?.split(',').join(' ') ||
                'fullName email phone birthdate height weight';
            const user = await user_model_1.default.findById(id).select(projection);
            if (!user)
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({
                message: 'Erro ao buscar dados do usuário.',
                error: error.message,
            });
        }
    }
    async list(_, res) {
        const users = await user_model_1.default.find().select('fullName email phone birthdate height weight');
        res.json(users);
    }
    async delete(req, res) {
        const { id } = req.params;
        const response = await user_model_1.default.findByIdAndDelete(id);
        if (response)
            res.json(response);
        else
            res.status(404).json({ message: 'Registro inexistente' });
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { fullName, email, phone, birthdate, height, weight, password, confirmPassword, } = req.body;
            const updateData = {
                fullName,
                email,
                phone,
                birthdate,
                height,
                weight,
            };
            if (password || confirmPassword) {
                if (password !== confirmPassword) {
                    res.status(400).json({ message: 'As senhas não coincidem.' });
                    return;
                }
                updateData.password = await bcrypt_1.default.hash(password, 10);
            }
            const response = await user_model_1.default.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            }).select('-password');
            if (response)
                res.json(response);
            else
                res.status(404).json({ message: 'Registro inexistente' });
        }
        catch (e) {
            if (e.code === 11000) {
                res
                    .status(400)
                    .json({ message: `O e-mail ${req.body.email} já está em uso.` });
            }
            else if (e.errors) {
                const messages = Object.values(e.errors).map((err) => err.message);
                res.status(400).json({ message: messages });
            }
            else {
                res
                    .status(500)
                    .json({ message: e.message || 'Erro ao atualizar usuário.' });
            }
        }
    }
}
exports.default = new UsersController();
