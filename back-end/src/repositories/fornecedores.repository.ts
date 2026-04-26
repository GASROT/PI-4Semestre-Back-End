import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import type { CreateFornecedorDto, UpdateFornecedorDto } from '../modules/fornecedores/fornecedores.dto';

export const fornecedoresRepository = {
  create(data: CreateFornecedorDto) {
    return prisma.fornecedor.create({ data });
  },

  list() {
    return prisma.fornecedor.findMany({ orderBy: { razao_social: 'asc' } });
  },

  findById(id: string) {
    return prisma.fornecedor.findUnique({ where: { id } });
  },

  update(id: string, data: UpdateFornecedorDto) {
    return prisma.fornecedor.update({ where: { id }, data });
  },

  deactivate(id: string) {
    return prisma.fornecedor.update({
      where: { id },
      data: { ativo: false },
    });
  },
};
