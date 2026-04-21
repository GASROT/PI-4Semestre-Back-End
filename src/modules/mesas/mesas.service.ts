import type { Prisma, StatusMesa } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { notFound } from '../../utils/http-error';

type CreateMesaInput = {
  numero: number;
  capacidade: number;
  codigo_mesa: number;
};

type UpdateMesaInput = Partial<CreateMesaInput> & {
  status?: StatusMesa;
  ativa?: boolean;
};

export const mesasService = {
  async create(data: CreateMesaInput) {
    return prisma.mesa.create({ data });
  },

  async list() {
    return prisma.mesa.findMany({ orderBy: { numero: 'asc' } });
  },

  async getById(id: string) {
    return prisma.mesa.findUnique({
      where: { id },
      include: {
        pedidos: true,
        usuarios: true,
      },
    });
  },

  async update(id: string, data: UpdateMesaInput) {
    return prisma.mesa.update({ where: { id }, data });
  },

  async abrir(id: string) {
    return prisma.mesa.update({
      where: { id },
      data: {
        status: 'OCUPADA',
        aberta_em: new Date(),
        fechada_em: null,
      },
    });
  },

  async fechar(id: string) {
    return prisma.$transaction(async (tx) => {
      const mesa = await tx.mesa.findUnique({ where: { id } });
      if (!mesa) {
        throw notFound('Mesa nao encontrada.');
      }

      const totals = await tx.pedido.aggregate({
        _sum: { valor_total: true },
        where: { mesa_id: id },
      });

      return tx.mesa.update({
        where: { id },
        data: {
          status: 'LIVRE',
          fechada_em: new Date(),
          total: totals._sum.valor_total ?? 0,
        },
      });
    });
  },
};
