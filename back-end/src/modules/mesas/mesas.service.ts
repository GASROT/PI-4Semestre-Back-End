import type { CreateMesaDto, UpdateMesaDto } from './mesas.dto';
import { mesasRepository } from '../../repositories/mesas.repository';
import { prisma } from '../../config/prisma';
import { tokenGenerator } from '../../utils/token-generator';
import { qrCodeGenerator } from '../../utils/qrcode-generator';
import { StatusMesa, TipoEvento } from '@prisma/client';

export const mesasService = {
  async create(data: CreateMesaDto) {
    return mesasRepository.create(data);
  },

  async list() {
    return mesasRepository.list();
  },

  async getById(id: string) {
    return mesasRepository.findById(id);
  },

  async update(id: string, data: UpdateMesaDto) {
    return mesasRepository.update(id, data);
  },

  async abrir(id: string) {
    return mesasRepository.open(id);
  },

  async fechar(id: string) {
    return mesasRepository.close(id);
  },

  // ===== NOVOS MÉTODOS PARA QRCODE E TOKENS =====

  /**
   * Gera QR Code para uma mesa
   * Cria token e sessão ID para validação de acesso
   */
  async gerarQrCodeMesa(mesa_id: string) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { id: true, numero: true, status: true },
    });

    if (!mesa) {
      throw new Error('Mesa não encontrada');
    }

    const { token, expira_em } = tokenGenerator.gerar(mesa_id);
    const sessao_id = tokenGenerator.gerarSessaoId();

    const mesaAtualizada = await prisma.mesa.update({
      where: { id: mesa_id },
      data: {
        token_acesso: token,
        sessao_id,
        status: StatusMesa.DISPONIVEL,
      },
      select: { id: true, numero: true },
    });

    const url_qr = qrCodeGenerator.gerarUrl(mesaAtualizada.numero, token);

    await this.registrarEvento(mesa_id, TipoEvento.MESA_ABERTA, 'QR Code gerado');

    return {
      mesa_id: mesaAtualizada.id,
      numero: mesaAtualizada.numero,
      url_qr,
      token_acesso: token,
      token_expira_em: expira_em,
      sessao_id,
    };
  },

  /**
   * Verifica disponibilidade de uma mesa
   */
  async verificarDisponibilidade(mesa_id: string): Promise<boolean> {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { status: true },
    });

    return mesa?.status === StatusMesa.DISPONIVEL;
  },

  /**
   * Abre uma mesa e gera novo token
   */
  async abrirMesaComToken(mesa_id: string) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { id: true, numero: true, status: true },
    });

    if (!mesa) throw new Error('Mesa não encontrada');
    if (mesa.status !== StatusMesa.DISPONIVEL) {
      throw new Error('Mesa não está disponível');
    }

    const { token, expira_em } = tokenGenerator.gerar(mesa_id);
    const sessao_id = tokenGenerator.gerarSessaoId();

    await prisma.mesa.update({
      where: { id: mesa_id },
      data: {
        token_acesso: token,
        sessao_id,
        status: StatusMesa.OCUPADA,
        aberta_em: new Date(),
      },
    });

    await this.registrarEvento(mesa_id, TipoEvento.MESA_ABERTA, 'Mesa aberta para cliente');

    const url_qr = qrCodeGenerator.gerarUrl(mesa.numero, token);

    return {
      mesa_id,
      numero: mesa.numero,
      url_qr,
      token_acesso: token,
      token_expira_em: expira_em,
      sessao_id,
    };
  },

  /**
   * Fecha uma mesa
   */
  async fecharMesaComEvento(mesa_id: string) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { id: true },
    });

    if (!mesa) throw new Error('Mesa não encontrada');

    await prisma.mesa.update({
      where: { id: mesa_id },
      data: {
        status: StatusMesa.DISPONIVEL,
        token_acesso: null,
        sessao_id: null,
        fechada_em: new Date(),
      },
    });

    await this.registrarEvento(mesa_id, TipoEvento.MESA_FECHADA, 'Mesa liberada');
  },

  /**
   * Valida token de acesso a uma mesa
   */
  async validarTokenAcesso(mesa_id: string, token: string) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { id: true, numero: true, token_acesso: true, sessao_id: true },
    });

    if (!mesa) throw new Error('Mesa não encontrada');
    if (mesa.token_acesso !== token) throw new Error('Token inválido');

    const valido = tokenGenerator.validar(token, mesa_id);
    if (!valido) throw new Error('Token expirado ou inválido');

    const comanda = await this.obterComandaAtivaByMesa(mesa_id);

    return {
      valido: true,
      mesa_numero: mesa.numero,
      sessao_id: mesa.sessao_id,
      comanda_id: comanda?.id,
    };
  },

  /**
   * Busca mesa por número
   */
  async findByNumero(numero: number) {
    return prisma.mesa.findUnique({
      where: { numero },
      include: {
        comandas: { where: { status: 'ABERTA' } },
        eventos: { take: 10, orderBy: { criado_em: 'desc' } },
      },
    });
  },

  /**
   * Obtém comanda ativa de uma mesa
   */
  async obterComandaAtivaByMesa(mesa_id: string) {
    return prisma.comanda.findFirst({
      where: { mesa_id, status: 'ABERTA' },
      include: { pedidos: true },
    });
  },

  /**
   * Registra evento de mesa
   */
  async registrarEvento(
    mesa_id: string,
    tipo: TipoEvento,
    descricao?: string,
    device_id?: string,
  ) {
    return prisma.eventoMesa.create({
      data: {
        mesa_id,
        tipo,
        descricao,
        device_id,
      },
    });
  },

  /**
   * Obtém status da mesa formatado para hardware
   */
  async obterStatusMesaParaHardware(numero: number) {
    const mesa = await prisma.mesa.findUnique({
      where: { numero },
      select: {
        id: true,
        status: true,
        token_acesso: true,
        numero: true,
        capacidade: true,
        atualizado_em: true,
      },
    });

    if (!mesa) throw new Error('Mesa não encontrada');

    const url = qrCodeGenerator.gerarUrl(
      mesa.numero,
      mesa.token_acesso || 'no-token',
    );

    return {
      id: mesa.id,
      st: mesa.status,
      tk: mesa.token_acesso || '',
      url,
      num: mesa.numero,
      cap: mesa.capacidade,
      upd: mesa.atualizado_em,
    };
  },

  /**
   * Define status de uma mesa
   */
  async definirStatusMesa(mesa_id: string, status: StatusMesa) {
    return prisma.mesa.update({
      where: { id: mesa_id },
      data: { status, atualizado_em: new Date() },
    });
  },

  /**
   * Registra device hardware (ESP32) vinculado à mesa
   */
  async registrarDeviceHardware(mesa_id: string, device_id: string) {
    return prisma.mesa.update({
      where: { id: mesa_id },
      data: { device_id },
    });
  },

  /**
   * Lista eventos de uma mesa
   */
  async listarEventosMesa(mesa_id: string, limite: number = 50) {
    return prisma.eventoMesa.findMany({
      where: { mesa_id },
      orderBy: { criado_em: 'desc' },
      take: limite,
    });
  },

  /**
   * Obtém relatório de uso de mesas por data
   */
  async relatorioUsoPorData(data: Date) {
    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(data);
    fim.setHours(23, 59, 59, 999);

    const eventos = await prisma.eventoMesa.findMany({
      where: {
        criado_em: { gte: inicio, lte: fim },
        tipo: { in: [TipoEvento.MESA_ABERTA, TipoEvento.MESA_FECHADA] },
      },
      include: { mesa: { select: { numero: true } } },
      orderBy: { criado_em: 'asc' },
    });

    return eventos;
  },

  // ===== ENDPOINTS TOTEM =====

  /**
   * Fluxo atômico de Check-in via Totem
   * Verifica disponibilidade, cria comanda e gera QR Code
   */
  async totemCheckin(mesa_id: string, nome_cliente: string, telefone: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Verifica disponibilidade
      const mesa = await tx.mesa.findUnique({
        where: { id: mesa_id },
        select: { id: true, numero: true, status: true },
      });

      if (!mesa) throw new Error('Mesa não encontrada');
      if (mesa.status !== StatusMesa.DISPONIVEL) {
        throw new Error('Mesa não está disponível para ocupação');
      }

      // 2. Gera token e sessão
      const { token, expira_em } = tokenGenerator.gerar(mesa_id);
      const sessao_id = tokenGenerator.gerarSessaoId();

      // 3. Atualiza mesa
      const mesaAtualizada = await tx.mesa.update({
        where: { id: mesa_id },
        data: {
          status: StatusMesa.OCUPADA,
          token_acesso: token,
          sessao_id,
          aberta_em: new Date(),
        },
        select: { id: true, numero: true },
      });

      // 4. Cria comanda
      const comanda = await tx.comanda.create({
        data: {
          mesa_id,
          status: 'ABERTA',
        },
      });

      // 5. Cria pedido
      const numPedido = Math.floor(Math.random() * 10000) + 1;
      await tx.pedido.create({
        data: {
          mesa_id,
          comanda_id: comanda.id,
          num_pedido: numPedido,
          status_preparo: 'PENDENTE',
          status_pagamento: 'ABERTO',
        },
      });

      // 6. Registra evento
      await tx.eventoMesa.create({
        data: {
          mesa_id,
          tipo: TipoEvento.MESA_ABERTA,
          descricao: `Check-in: ${nome_cliente} (${telefone})`,
        },
      });

      // 7. Gera URL do QR Code
      const url_qr = qrCodeGenerator.gerarUrl(mesaAtualizada.numero, token);

      return {
        mesa_id: mesaAtualizada.id,
        numero: mesaAtualizada.numero,
        comanda_id: comanda.id,
        url_qr,
        token_acesso: token,
        token_expira_em: expira_em,
        sessao_id,
        nome_cliente,
        checkin_em: new Date(),
      };
    });
  },

  // ===== ENDPOINTS KDS (COZINHA) =====

  /**
   * Obtém fila de preparo da cozinha filtrada por status
   */
  async obterFilaKds(status: 'PENDENTE' | 'EM_PREPARO' | 'PRONTO') {
    const fila = await prisma.pedido.findMany({
      where: { status_preparo: status },
      include: {
        itens: { include: { produto: { select: { nome: true } } } },
        mesa: { select: { numero: true } },
      },
      orderBy: { data_hora: 'asc' },
    });

    return fila.map((pedido) => ({
      pedido_id: pedido.id,
      num_pedido: pedido.num_pedido,
      mesa_numero: pedido.mesa.numero,
      cliente: 'Cliente',
      status: pedido.status_preparo,
      tempo_espera_minutos: Math.floor(
        (Date.now() - pedido.data_hora.getTime()) / 60000,
      ),
      itens: pedido.itens.map((item) => ({
        num_item: item.num_item,
        produto: item.produto.nome,
        quantidade: item.quantidade,
      })),
    }));
  },

  /**
   * Atualiza status de um pedido na cozinha
   */
  async atualizarStatusPreparo(pedido_id: string, novo_status: 'PENDENTE' | 'EM_PREPARO' | 'PRONTO') {
    return await prisma.pedido.update({
      where: { id: pedido_id },
      data: { status_preparo: novo_status, atualizado_em: new Date() },
    });
  },

  /**
   * Marca mesa como pronta para entregar na cozinha
   */
  async finalizarKds(mesa_id: string) {
    // Busca todos os pedidos da mesa
    const pedidos = await prisma.pedido.findMany({
      where: { mesa_id, status_preparo: { in: ['EM_PREPARO', 'PRONTO'] } },
    });

    // Marca todos como PRONTO
    await Promise.all(
      pedidos.map((p) =>
        prisma.pedido.update({
          where: { id: p.id },
          data: { status_preparo: 'PRONTO' },
        }),
      ),
    );

    // Registra evento
    await this.registrarEvento(mesa_id, TipoEvento.MESA_ABERTA, 'Finalizado na cozinha');

    return { sucesso: true, pedidos_finalizados: pedidos.length };
  },

  // ===== ENDPOINTS CHECKOUT =====

  /**
   * Calcula total de uma mesa incluindo todos os pedidos
   */
  async obterTotalCheckout(mesa_id: string) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { numero: true, total: true },
    });

    if (!mesa) throw new Error('Mesa não encontrada');

    // Busca comanda ativa
    const comanda = await prisma.comanda.findFirst({
      where: { mesa_id, status: 'ABERTA' },
    });

    if (!comanda) throw new Error('Nenhuma comanda aberta para esta mesa');

    // Busca todos os pedidos não cancelados
    const pedidos = await prisma.pedido.findMany({
      where: {
        mesa_id,
        status_pagamento: { in: ['ABERTO', 'PARCIAL'] },
      },
      include: { itens: { select: { subtotal: true } } },
    });

    // Calcula total
    const total = pedidos.reduce(
      (sum, pedido) =>
        sum + pedido.itens.reduce((subtotal, item) => subtotal + item.subtotal, 0),
      0,
    );

    return {
      mesa_numero: mesa.numero,
      comanda_id: comanda.id,
      total: parseFloat(total.toFixed(2)),
      quantidade_pedidos: pedidos.length,
    };
  },

  /**
   * Finaliza checkout e fecha mesa
   */
  async finalizarCheckout(mesa_id: string, metodo_pagamento: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Busca mesa
      const mesa = await tx.mesa.findUnique({ where: { id: mesa_id } });
      if (!mesa) throw new Error('Mesa não encontrada');

      // 2. Busca comanda ativa
      const comanda = await tx.comanda.findFirst({
        where: { mesa_id, status: 'ABERTA' },
      });

      if (!comanda) throw new Error('Nenhuma comanda aberta');

      // 3. Busca todos os pedidos
      const pedidos = await tx.pedido.findMany({
        where: { mesa_id },
        include: { itens: { select: { subtotal: true } } },
      });

      // 4. Calcula total
      const total = pedidos.reduce(
        (sum, p) => sum + p.itens.reduce((s, i) => s + i.subtotal, 0),
        0,
      );

      // 5. Marca todos os pedidos como PAGO
      await Promise.all(
        pedidos.map((p) =>
          tx.pedido.update({
            where: { id: p.id },
            data: { status_pagamento: 'PAGO' },
          }),
        ),
      );

      // 6. Finaliza comanda
      await tx.comanda.update({
        where: { id: comanda.id },
        data: {
          status: 'FINALIZADA',
          total: total,
          finalizado_em: new Date(),
        },
      });

      // 7. Libera mesa
      await tx.mesa.update({
        where: { id: mesa_id },
        data: {
          status: StatusMesa.DISPONIVEL,
          token_acesso: null,
          sessao_id: null,
          fechada_em: new Date(),
          total: 0,
        },
      });

      // 8. Registra evento
      await tx.eventoMesa.create({
        data: {
          mesa_id,
          tipo: TipoEvento.MESA_FECHADA,
          descricao: `Checkout finalizado - ${metodo_pagamento} - Total: R$ ${total.toFixed(2)}`,
        },
      });

      return {
        sucesso: true,
        mesa_numero: mesa.numero,
        total: parseFloat(total.toFixed(2)),
        metodo_pagamento,
        data_fechamento: new Date(),
      };
    });
  },

  // ===== ENDPOINTS HISTÓRICO =====

  /**
   * Obtém histórico de comandas com filtros opcionais
   */
  async obterHistoricoComandas(
    data_inicio?: string,
    data_fim?: string,
    mesa_numero?: number,
  ) {
    const filtros: any = { finalizado_em: { not: null } };

    // Filtro de data
    if (data_inicio && data_fim) {
      filtros.criado_em = {
        gte: new Date(data_inicio),
        lte: new Date(data_fim),
      };
    }

    // Busca comandas com mesa relacionada
    const comandas = await prisma.comanda.findMany({
      where: filtros,
      include: {
        mesa: { select: { numero: true } },
        pedidos: { include: { itens: { include: { produto: { select: { nome: true } } } } } },
      },
      orderBy: { criado_em: 'desc' },
    });

    // Filtra por número de mesa se informado
    let resultado = comandas;
    if (mesa_numero) {
      resultado = comandas.filter((c) => c.mesa.numero === mesa_numero);
    }

    // Formata resposta
    return resultado.map((comanda) => ({
      comanda_id: comanda.id,
      mesa_numero: comanda.mesa.numero,
      cliente: 'Cliente',
      total: comanda.total,
      data: comanda.criado_em,
      quantidade_itens: comanda.pedidos.reduce(
        (sum, p) => sum + p.itens.length,
        0,
      ),
      detalhes: comanda.pedidos.map((p) => ({
        pedido_id: p.id,
        itens: p.itens.map((i) => ({ produto: i.produto.nome, qtd: i.quantidade })),
      })),
    }));
  },
};
