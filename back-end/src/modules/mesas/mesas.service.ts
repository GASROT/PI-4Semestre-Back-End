import type { CreateMesaDto, UpdateMesaDto } from './mesas.dto';
import { mesasRepository } from '../../repositories/mesas.repository';

export const mesasService = {
  async create(data: CreateMesaDto) {
    return mesasRepository.create(data);
  },

  async list() {
    return mesasRepository.list();
  },

  async getById(id: string) {
    return mesasRepository.findById(id);
  },

  async update(id: string, data: UpdateMesaDto) {
    return mesasRepository.update(id, data);
  },

  async abrir(id: string) {
    return mesasRepository.open(id);
  },

  async fechar(id: string) {
    return mesasRepository.close(id);
  },
};
