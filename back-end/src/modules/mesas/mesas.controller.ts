import type { Request, Response } from 'express';
import { mesasService } from './mesas.service';
import type { CreateMesaDto, MesaParamsDto, UpdateMesaDto } from './mesas.dto';

export const mesasController = {
  async create(req: Request, res: Response) {
    const mesa = await mesasService.create(req.body as CreateMesaDto);
    res.status(201).json({ success: true, data: mesa });
  },

  async list(_req: Request, res: Response) {
    const mesas = await mesasService.list();
    res.status(200).json({ success: true, data: mesas });
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params as MesaParamsDto;
    const mesa = await mesasService.getById(id);
    if (!mesa) {
      res.status(404).json({ success: false, message: 'Mesa nao encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: mesa });
  },

  async update(req: Request, res: Response) {
    const { id } = req.params as MesaParamsDto;
    const mesa = await mesasService.update(id, req.body as UpdateMesaDto);
    res.status(200).json({ success: true, data: mesa });
  },

  async abrir(req: Request, res: Response) {
    const { id } = req.params as MesaParamsDto;
    const mesa = await mesasService.abrir(id);
    res.status(200).json({ success: true, data: mesa });
  },

  async fechar(req: Request, res: Response) {
    const { id } = req.params as MesaParamsDto;
    const mesa = await mesasService.fechar(id);
    res.status(200).json({ success: true, data: mesa });
  },
};
