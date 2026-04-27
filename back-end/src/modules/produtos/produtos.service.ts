import type { CreateProdutoDto, UpdateProdutoDto } from './produtos.dto';
import { produtosRepository } from '../../repositories/produtos.repository';

export const produtosService = {
  async create(data: CreateProdutoDto) {
    return produtosRepository.create(data);
  },

  async list() {
    return produtosRepository.list();
  },

  async getById(id: string) {
    return produtosRepository.findById(id);
  },

  async update(id: string, data: UpdateProdutoDto) {
    return produtosRepository.update(id, data);
  },

  async deactivate(id: string) {
    return produtosRepository.deactivate(id);
  },
};
