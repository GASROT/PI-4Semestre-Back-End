import { prisma } from '../../config/prisma';

type CreateFornecedorInput = {
  razao_social: string;
  cnpj: string;
};

type UpdateFornecedorInput = Partial<CreateFornecedorInput>;

export const fornecedoresService = {
  async create(data: CreateFornecedorInput) {
    return prisma.fornecedor.create({ data });
  },

  async list() {
    return prisma.fornecedor.findMany({ orderBy: { razao_social: 'asc' } });
  },

  async getById(id: string) {
    return prisma.fornecedor.findUnique({ where: { id } });
  },

  async update(id: string, data: UpdateFornecedorInput) {
    return prisma.fornecedor.update({ where: { id }, data });
  },

  async deactivate(id: string) {
    return prisma.fornecedor.update({
      where: { id },
      data: { ativo: false },
    });
  },
};
