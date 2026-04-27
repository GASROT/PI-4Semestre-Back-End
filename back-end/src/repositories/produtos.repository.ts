import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import type { CreateProdutoDto, UpdateProdutoDto } from '../modules/produtos/produtos.dto';

export const produtosRepository = {
  create(data: CreateProdutoDto) {
    return prisma.produto.create({ data });
  },

  list() {
    return prisma.produto.findMany({
      where: { ativo: true },
      orderBy: { criado_em: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.produto.findUnique({ where: { id } });
  },

  update(id: string, data: UpdateProdutoDto) {
    return prisma.produto.update({ where: { id }, data });
  },

  deactivate(id: string) {
    return prisma.produto.update({
      where: { id },
      data: {
        ativo: false,
        desativado_em: new Date(),
      },
    });
  },
};
