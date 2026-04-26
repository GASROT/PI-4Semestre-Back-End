import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { NextFunction, Request, Response } from 'express';
import { usuariosService } from './usuarios.service';
import type { CreateUsuarioDto, UpdateUsuarioDto, UsuarioParamsDto } from './usuarios.dto';

function mapPrismaError(error: unknown, next: NextFunction) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return next(new Error('Violacao de unicidade: email/cpf ja cadastrado.'));
    }
  }
  return next(error);
}

export const usuariosController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await usuariosService.create(req.body as CreateUsuarioDto);
      res.status(201).json({ success: true, data: usuario });
    } catch (error) {
      mapPrismaError(error, next);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios = await usuariosService.list();
      res.status(200).json({ success: true, data: usuarios });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as UsuarioParamsDto;
      const usuario = await usuariosService.getById(id);
      if (!usuario) {
        res.status(404).json({ success: false, message: 'Usuario nao encontrado' });
        return;
      }
      res.status(200).json({ success: true, data: usuario });
      return;
    } catch (error) {
      next(error);
      return;
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as UsuarioParamsDto;
      const usuario = await usuariosService.update(id, req.body as UpdateUsuarioDto);
      res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      mapPrismaError(error, next);
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as UsuarioParamsDto;
      const usuario = await usuariosService.deactivate(id);
      res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  },
};
