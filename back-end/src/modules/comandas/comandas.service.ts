import { prisma } from '../../config/prisma';
import { ComandaStatus } from '@prisma/client';

let numPedidoCounter = 1;

export const comandasService = {
  /**
   * Cria uma nova comanda para uma mesa
   */
  async criarComanda(mesa_id: string, usuario_id?: string) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { id: true, numero: true },
    });

    if (!mesa) throw new Error('Mesa não encontrada');

    // Verificar se já existe comanda aberta
    const comandaExistente = await prisma.comanda.findFirst({
      where: { mesa_id, status: ComandaStatus.ABERTA },
    });

    if (comandaExistente) {
      throw new Error('Já existe uma comanda aberta nesta mesa');
    }

    return prisma.comanda.create({
      data: {
        mesa_id,
        usuario_id,
        status: ComandaStatus.ABERTA,
        total: 0,
      },
      include: {
        mesa: { select: { numero: true } },
      },
    });
  },

  /**
   * Adiciona um produto à comanda (cria item de pedido)
   */
  async adicionarProduto(
    comanda_id: string,
    produto_id: string,
    quantidade: number,
  ) {
    const comanda = await prisma.comanda.findUnique({
      where: { id: comanda_id },
      include: { mesa: { select: { id: true } } },
    });

    if (!comanda) throw new Error('Comanda não encontrada');
    if (comanda.status !== ComandaStatus.ABERTA) {
      throw new Error('Comanda não está aberta');
    }

    const produto = await prisma.produto.findUnique({
      where: { id: produto_id },
      select: { id: true, nome: true, preco_unitario: true },
    });

    if (!produto) throw new Error('Produto não encontrado');

    const subtotal = produto.preco_unitario * quantidade;

    // Verificar se há pedido aberto na comanda
    let pedido = await prisma.pedido.findFirst({
      where: { comanda_id, status_preparo: 'PENDENTE' },
    });

    // Se não houver pedido aberto, criar um novo
    if (!pedido) {
      const maxNumPedido = await prisma.pedido.aggregate({
        _max: { num_pedido: true },
      });
      const novoNum = (maxNumPedido._max.num_pedido || 0) + 1;

      pedido = await prisma.pedido.create({
        data: {
          mesa_id: comanda.mesa.id,
          comanda_id,
          num_pedido: novoNum,
        },
      });
    }

    // Obter próximo num_item para este pedido
    const maxItem = await prisma.itemPedido.aggregate({
      where: { pedido_id: pedido.id },
      _max: { num_item: true },
    });
    const novoNumItem = (maxItem._max.num_item || 0) + 1;

    // Criar item do pedido
    const itemPedido = await prisma.itemPedido.create({
      data: {
        pedido_id: pedido.id,
        produto_id,
        num_item: novoNumItem,
        quantidade,
        preco_snapshot: produto.preco_unitario,
        subtotal,
      },
      include: { produto: true },
    });

    // Atualizar valor_total do pedido
    await this.atualizarTotalPedido(pedido.id);

    // Atualizar total da comanda
    await this.atualizarTotalComanda(comanda_id);

    return itemPedido;
  },

  /**
   * Obtém comanda ativa de uma mesa
   */
  async obterComandaAtivaByMesa(mesa_id: string) {
    return prisma.comanda.findFirst({
      where: { mesa_id, status: ComandaStatus.ABERTA },
      include: {
        mesa: { select: { numero: true } },
      },
    });
  },

  /**
   * Obtém uma comanda pelo ID com seus pedidos e itens
   */
  async obterPorId(comanda_id: string) {
    return prisma.comanda.findUnique({
      where: { id: comanda_id },
      include: {
        mesa: { select: { numero: true } },
        usuario: { select: { id: true, nome: true } },
      },
    });
  },

  /**
   * Lista pedidos de uma comanda com seus itens
   */
  async listarPedidos(comanda_id: string) {
    return prisma.pedido.findMany({
      where: { comanda_id },
      include: {
        itens: {
          include: { produto: true },
        },
      },
      orderBy: { criado_em: 'asc' },
    });
  },

  /**
   * Lista itens de um pedido
   */
  async listarItensPedido(pedido_id: string) {
    return prisma.itemPedido.findMany({
      where: { pedido_id },
      include: { produto: true },
      orderBy: { num_item: 'asc' },
    });
  },

  /**
   * Remove um item do pedido
   */
  async removerItem(item_id: string) {
    const item = await prisma.itemPedido.findUnique({
      where: { id: item_id },
      select: { pedido_id: true },
    });

    if (!item) throw new Error('Item não encontrado');

    await prisma.itemPedido.delete({ where: { id: item_id } });

    // Recalcular total do pedido
    await this.atualizarTotalPedido(item.pedido_id);

    // Recalcular total da comanda
    const pedido = await prisma.pedido.findUnique({
      where: { id: item.pedido_id },
      select: { comanda_id: true },
    });

    if (pedido?.comanda_id) {
      await this.atualizarTotalComanda(pedido.comanda_id);
    }
  },

  /**
   * Finaliza uma comanda
   */
  async finalizarComanda(comanda_id: string) {
    const comanda = await prisma.comanda.findUnique({
      where: { id: comanda_id },
    });

    if (!comanda) throw new Error('Comanda não encontrada');
    if (comanda.status !== ComandaStatus.ABERTA) {
      throw new Error('Comanda não está aberta');
    }

    return prisma.comanda.update({
      where: { id: comanda_id },
      data: {
        status: ComandaStatus.FINALIZADA,
        finalizado_em: new Date(),
      },
    });
  },

  /**
   * Cancela uma comanda
   */
  async cancelarComanda(comanda_id: string) {
    const comanda = await prisma.comanda.findUnique({
      where: { id: comanda_id },
    });

    if (!comanda) throw new Error('Comanda não encontrada');
    if (comanda.status === ComandaStatus.CANCELADA) {
      throw new Error('Comanda já foi cancelada');
    }

    return prisma.comanda.update({
      where: { id: comanda_id },
      data: {
        status: ComandaStatus.CANCELADA,
        finalizado_em: new Date(),
      },
    });
  },

  /**
   * Atualiza o valor_total do pedido somando todos os itens
   */
  async atualizarTotalPedido(pedido_id: string) {
    const itens = await prisma.itemPedido.findMany({
      where: { pedido_id },
    });

    const total = itens.reduce((acc, item) => acc + item.subtotal, 0);

    await prisma.pedido.update({
      where: { id: pedido_id },
      data: { valor_total: total },
    });
  },

  /**
   * Atualiza o total da comanda somando todos os pedidos
   */
  async atualizarTotalComanda(comanda_id: string) {
    const pedidos = await prisma.pedido.findMany({
      where: { comanda_id },
    });

    const total = pedidos.reduce((acc, p) => acc + p.valor_total, 0);

    await prisma.comanda.update({
      where: { id: comanda_id },
      data: { total },
    });
  },

  /**
   * Obtém histórico de comandas de uma mesa
   */
  async historicoByMesa(mesa_id: string) {
    return prisma.comanda.findMany({
      where: { mesa_id },
      include: {
        mesa: { select: { numero: true } },
      },
      orderBy: { criado_em: 'desc' },
    });
  },

  /**
   * Obtém todas as mesas com comandas abertas
   */
  async obterMesasComComandasAbertas() {
    return prisma.mesa.findMany({
      where: {
        comandas: {
          some: { status: ComandaStatus.ABERTA },
        },
      },
      include: {
        comandas: {
          where: { status: ComandaStatus.ABERTA },
        },
      },
    });
  },
};
