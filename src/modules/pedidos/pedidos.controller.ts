import type { Request, Response } from 'express';
import { pedidosService } from './pedidos.service';
import { getStringParam } from '../../utils/request-params';

export const pedidosController = {
  async create(req: Request, res: Response) {
    const pedido = await pedidosService.create(req.body);
    res.status(201).json({ success: true, data: pedido });
  },

  async list(_req: Request, res: Response) {
    const pedidos = await pedidosService.list();
    res.status(200).json({ success: true, data: pedidos });
  },

  async getById(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const pedido = await pedidosService.getById(id);
    if (!pedido) {
      res.status(404).json({ success: false, message: 'Pedido nao encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: pedido });
  },

  async addItem(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const item = await pedidosService.addItem(id, req.body);
    res.status(201).json({ success: true, data: item });
  },

  async updateStatus(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const pedido = await pedidosService.updateStatus(id, req.body);
    res.status(200).json({ success: true, data: pedido });
  },

  async cancel(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const pedido = await pedidosService.cancel(id);
    res.status(200).json({ success: true, data: pedido });
  },
};
