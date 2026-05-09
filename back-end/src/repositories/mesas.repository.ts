import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import type { CreateMesaDto, UpdateMesaDto } from '../modules/mesas/mesas.dto';

export const mesasRepository = {
  create(data: CreateMesaDto) {
    return prisma.mesa.create({ data });
  },

  list() {
    return prisma.mesa.findMany({ orderBy: { numero: 'asc' } });
  },

  findById(id: string) {
    return prisma.mesa.findUnique({
      where: { id },
      include: {
        pedidos: true,
        usuarios: true,
      },
    });
  },

  update(id: string, data: UpdateMesaDto) {
    return prisma.mesa.update({ where: { id }, data });
  },

  open(id: string) {
    return prisma.mesa.update({
      where: { id },
      data: {
        status: 'OCUPADA',
        aberta_em: new Date(),
        fechada_em: null,
      },
    });
  },

  close(id: string) {
    return prisma.$transaction(async (tx) => {
      const mesa = await tx.mesa.findUnique({ where: { id } });
      if (!mesa) {
        return null;
      }

      const totals = await tx.pedido.aggregate({
        _sum: { valor_total: true },
        where: { mesa_id: id },
      });

      return tx.mesa.update({
        where: { id },
        data: {
          status: 'DISPONIVEL',
          fechada_em: new Date(),
          total: totals._sum.valor_total ?? 0,
        },
      });
    });
  },
};
