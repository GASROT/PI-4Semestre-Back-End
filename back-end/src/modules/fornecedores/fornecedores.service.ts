import type { CreateFornecedorDto, UpdateFornecedorDto } from './fornecedores.dto';
import { fornecedoresRepository } from '../../repositories/fornecedores.repository';

export const fornecedoresService = {
  async create(data: CreateFornecedorDto) {
    return fornecedoresRepository.create(data);
  },

  async list() {
    return fornecedoresRepository.list();
  },

  async getById(id: string) {
    return fornecedoresRepository.findById(id);
  },

  async update(id: string, data: UpdateFornecedorDto) {
    return fornecedoresRepository.update(id, data);
  },

  async deactivate(id: string) {
    return fornecedoresRepository.deactivate(id);
  },
};
