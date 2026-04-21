import type { Prisma, StatusPagamento, StatusPreparo } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { badRequest, notFound } from '../../utils/http-error';

type CreatePedidoInput = {
  mesa_id: string;
  num_pedido: number;
};

type AddItemInput = {
  produto_id: string;
  quantidade: number;
  num_item?: number;
};

async function recalculatePedidoAndMesaTotals(tx: Prisma.TransactionClient, pedidoId: string) {
  const pedido = await tx.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido) {
    throw notFound('Pedido nao encontrado.');
  }

  const pedidoTotalAgg = await tx.itemPedido.aggregate({
    _sum: { subtotal: true },
    where: { pedido_id: pedidoId },
  });

  const pedidoTotal = pedidoTotalAgg._sum.subtotal ?? 0;

  await tx.pedido.update({
    where: { id: pedidoId },
    data: { valor_total: pedidoTotal },
  });

  const mesaTotalAgg = await tx.pedido.aggregate({
    _sum: { valor_total: true },
    where: { mesa_id: pedido.mesa_id },
  });

  await tx.mesa.update({
    where: { id: pedido.mesa_id },
    data: { total: mesaTotalAgg._sum.valor_total ?? 0 },
  });
}

export const pedidosService = {
  async create(data: CreatePedidoInput) {
    const mesa = await prisma.mesa.findUnique({ where: { id: data.mesa_id } });
    if (!mesa) {
      throw notFound('Mesa nao encontrada.');
    }

    return prisma.pedido.create({
      data: {
        mesa_id: data.mesa_id,
        num_pedido: data.num_pedido,
      },
    });
  },

  async list() {
    return prisma.pedido.findMany({
      include: {
        itens: true,
        mesa: true,
      },
      orderBy: { data_hora: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
        mesa: true,
      },
    });
  },

  async addItem(pedidoId: string, data: AddItemInput) {
    if (data.quantidade <= 0) {
      throw badRequest('Quantidade deve ser maior que zero.');
    }

    return prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({ where: { id: pedidoId } });
      if (!pedido) {
        throw notFound('Pedido nao encontrado.');
      }

      const produto = await tx.produto.findUnique({ where: { id: data.produto_id } });
      if (!produto || !produto.ativo) {
        throw notFound('Produto nao encontrado ou inativo.');
      }

      let numItem = data.num_item;
      if (!numItem) {
        const lastItem = await tx.itemPedido.findFirst({
          where: { pedido_id: pedidoId },
          orderBy: { num_item: 'desc' },
        });
        numItem = (lastItem?.num_item ?? 0) + 1;
      }

      const precoSnapshot = produto.preco_unitario;
      const subtotal = Number((precoSnapshot * data.quantidade).toFixed(2));

      const item = await tx.itemPedido.create({
        data: {
          pedido_id: pedidoId,
          produto_id: data.produto_id,
          num_item: numItem,
          quantidade: data.quantidade,
          preco_snapshot: precoSnapshot,
          subtotal,
        },
      });

      await recalculatePedidoAndMesaTotals(tx, pedidoId);

      return item;
    });
  },

  async updateStatus(id: string, payload: { status_preparo?: StatusPreparo; status_pagamento?: StatusPagamento }) {
    return prisma.pedido.update({
      where: { id },
      data: {
        status_preparo: payload.status_preparo,
        status_pagamento: payload.status_pagamento,
      },
    });
  },

  async cancel(id: string) {
    return prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.update({
        where: { id },
        data: {
          status_preparo: 'CANCELADO',
        },
      });

      await recalculatePedidoAndMesaTotals(tx, id);
      return pedido;
    });
  },
};
