import { prisma } from '../../config/prisma';

type CreateProdutoInput = {
  nome: string;
  preco_unitario: number;
  qtd_estoque: number;
};

type UpdateProdutoInput = Partial<CreateProdutoInput>;

export const produtosService = {
  async create(data: CreateProdutoInput) {
    return prisma.produto.create({ data });
  },

  async list() {
    return prisma.produto.findMany({
      where: { ativo: true },
      orderBy: { criado_em: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.produto.findUnique({ where: { id } });
  },

  async update(id: string, data: UpdateProdutoInput) {
    return prisma.produto.update({ where: { id }, data });
  },

  async deactivate(id: string) {
    return prisma.produto.update({
      where: { id },
      data: {
        ativo: false,
        desativado_em: new Date(),
      },
    });
  },
};
