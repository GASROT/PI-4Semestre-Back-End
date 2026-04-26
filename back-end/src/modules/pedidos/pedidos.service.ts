import type { AddItemPedidoDto, CreatePedidoDto, UpdateStatusPedidoDto } from './pedidos.dto';
import { pedidosRepository } from '../../repositories/pedidos.repository';

export const pedidosService = {
  async create(data: CreatePedidoDto) {
    return pedidosRepository.create(data);
  },

  async list() {
    return pedidosRepository.list();
  },

  async getById(id: string) {
    return pedidosRepository.findById(id);
  },

  async addItem(pedidoId: string, data: AddItemPedidoDto) {
    return pedidosRepository.addItem(pedidoId, data);
  },

  async updateStatus(id: string, payload: UpdateStatusPedidoDto) {
    return pedidosRepository.updateStatus(id, payload);
  },

  async cancel(id: string) {
    return pedidosRepository.cancel(id);
  },
};
