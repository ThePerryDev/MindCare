import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';

class UsersController {
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        fullName,
        email,
        phone,
        birthdate,
        height,
        weight,
        password,
        confirmPassword,
      } = req.body;
      if (password !== confirmPassword) {
        res.status(400).json({ message: 'As senhas não coincidem.' });
        return;
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = new UserModel({
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
    } catch (e: any) {
      if (e.code === 11000) {
        res.status(400).json({ message: 'E-mail já está em uso.' });
      } else if (e.errors) {
        const messages = Object.values(e.errors).map((err: any) => err.message);
        res.status(400).json({ message: messages });
      } else {
        res
          .status(500)
          .json({ message: e.message || 'Erro interno do servidor' });
      }
    }
  };

  public async getUserDataById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: 'O ID do usuário é necessário.' });
    try {
      const projection =
        (req.query.fields as string)?.split(',').join(' ') ||
        'fullName email phone birthdate height weight';
      const user = await UserModel.findById(id).select(projection);
      if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({
        message: 'Erro ao buscar dados do usuário.',
        error: error.message,
      });
    }
  }

  public async list(_: Request, res: Response): Promise<void> {
    const users = await UserModel.find().select(
      'fullName email phone birthdate height weight'
    );
    res.json(users);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await UserModel.findByIdAndDelete(id);
    if (response) res.json(response);
    else res.status(404).json({ message: 'Registro inexistente' });
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        fullName,
        email,
        phone,
        birthdate,
        height,
        weight,
        password,
        confirmPassword,
      } = req.body;
      const updateData: any = {
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
        updateData.password = await bcrypt.hash(password, 10);
      }
      const response = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select('-password');
      if (response) res.json(response);
      else res.status(404).json({ message: 'Registro inexistente' });
    } catch (e: any) {
      if (e.code === 11000) {
        res
          .status(400)
          .json({ message: `O e-mail ${req.body.email} já está em uso.` });
      } else if (e.errors) {
        const messages = Object.values(e.errors).map((err: any) => err.message);
        res.status(400).json({ message: messages });
      } else {
        res
          .status(500)
          .json({ message: e.message || 'Erro ao atualizar usuário.' });
      }
    }
  }

  public updateMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { height, weight, birthdate, fullName, phone } = req.body;
      const user = await UserModel.findById(id);
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }
      if (typeof height === 'number') user.height = height;
      if (typeof weight === 'number') user.weight = weight;
      if (birthdate) user.birthdate = new Date(birthdate);
      if (fullName) user.fullName = fullName;
      if (phone) user.phone = phone;
      await user.save();
      res.status(200).json(user.toJSON());
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Erro ao atualizar os dados.', error: error.message });
    }
  };
}

export default new UsersController();
