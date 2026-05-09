import type { Request, Response } from 'express';
import { mesasService } from './mesas.service';
import type { CreateMesaDto, MesaParamsDto, UpdateMesaDto } from './mesas.dto';

export const mesasController = {
  async create(req: Request, res: Response) {
    const mesa = await mesasService.create(req.body as CreateMesaDto);
    res.status(201).json({ success: true, data: mesa });
  },

  async list(_req: Request, res: Response) {
    const mesas = await mesasService.list();
    res.status(200).json({ success: true, data: mesas });
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params as MesaParamsDto;
    const mesa = await mesasService.getById(id);
    if (!mesa) {
      res.status(404).json({ success: false, message: 'Mesa nao encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: mesa });
  },

  async update(req: Request, res: Response) {
    const { id } = req.params as MesaParamsDto;
    const mesa = await mesasService.update(id, req.body as UpdateMesaDto);
    res.status(200).json({ success: true, data: mesa });
  },

  async abrir(req: Request, res: Response) {
    const { id } = req.params as MesaParamsDto;
    const mesa = await mesasService.abrir(id);
    res.status(200).json({ success: true, data: mesa });
  },

  async fechar(req: Request, res: Response) {
    const { id } = req.params as MesaParamsDto;
    const mesa = await mesasService.fechar(id);
    res.status(200).json({ success: true, data: mesa });
  },

  // ===== NOVOS ENDPOINTS PARA QRCODE =====

  /**
   * Gera QR Code para uma mesa
   * GET /mesas/:id/qrcode
   */
  async gerarQrCode(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const resultado = await mesasService.gerarQrCodeMesa(id);
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao gerar QR Code',
      });
    }
  },

  /**
   * Abre mesa e gera token
   * POST /mesas/:id/abrir-com-token
   */
  async abrirComToken(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const resultado = await mesasService.abrirMesaComToken(id);
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao abrir mesa',
      });
    }
  },

  /**
   * Fecha mesa
   * POST /mesas/:id/fechar-com-evento
   */
  async fecharComEvento(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await mesasService.fecharMesaComEvento(id);
      res.status(200).json({ success: true, message: 'Mesa fechada com sucesso' });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao fechar mesa',
      });
    }
  },

  /**
   * Valida token de acesso
   * GET /mesas/:id/validar-token?token=xyz
   */
  async validarToken(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { token } = req.query as { token: string | undefined };

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token é obrigatório',
        });
        return;
      }

      const resultado = await mesasService.validarTokenAcesso(id, token);
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token inválido',
      });
    }
  },

  /**
   * Obtém comanda ativa da mesa
   * GET /mesas/:id/comanda-ativa
   */
  async obterComandaAtivaByMesa(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const comanda = await mesasService.obterComandaAtivaByMesa(id);

      if (!comanda) {
        res.status(404).json({
          success: false,
          message: 'Nenhuma comanda ativa nesta mesa',
        });
        return;
      }

      res.status(200).json({ success: true, data: comanda });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter comanda',
      });
    }
  },

  /**
   * Lista eventos da mesa
   * GET /mesas/:id/eventos?limite=50
   */
  async listarEventos(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { limite } = req.query as { limite: string | undefined };
      const eventos = await mesasService.listarEventosMesa(
        id,
        limite ? parseInt(limite, 10) : 50,
      );

      res.status(200).json({ success: true, data: eventos });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao listar eventos',
      });
    }
  },

  // ===== TOTEM ENDPOINTS =====

  /**
   * Check-in Totem - Fluxo atômico
   * POST /mesas/:id/totem-checkin
   * Body: { nome_cliente, telefone }
   */
  async totemCheckin(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { nome_cliente, telefone } = req.body as { nome_cliente: string; telefone: string };

      if (!nome_cliente || !telefone) {
        res.status(400).json({
          success: false,
          message: 'Nome e telefone são obrigatórios',
        });
        return;
      }

      const resultado = await mesasService.totemCheckin(id, nome_cliente, telefone);
      res.status(201).json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro no check-in',
      });
    }
  },

  // ===== KDS ENDPOINTS =====

  /**
   * Obtém fila de cozinha
   * GET /mesas/kds/fila?status=PENDENTE|EM_PREPARO|PRONTO
   */
  async obterFilaKds(req: Request, res: Response) {
    try {
      const { status } = req.query as { status?: 'PENDENTE' | 'EM_PREPARO' | 'PRONTO' };
      const statusPadrao = status || 'PENDENTE';

      const fila = await mesasService.obterFilaKds(statusPadrao);
      res.status(200).json({ success: true, data: fila });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter fila KDS',
      });
    }
  },

  /**
   * Atualiza status de preparo de um pedido
   * PATCH /pedidos/:pedido_id/status
   * Body: { novo_status: PENDENTE|EM_PREPARO|PRONTO }
   */
  async atualizarStatusPreparo(req: Request, res: Response) {
    try {
      const { pedido_id } = req.params as { pedido_id: string };
      const { novo_status } = req.body as { novo_status: 'PENDENTE' | 'EM_PREPARO' | 'PRONTO' };

      const pedido = await mesasService.atualizarStatusPreparo(pedido_id, novo_status);
      res.status(200).json({ success: true, data: pedido });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar status',
      });
    }
  },

  /**
   * Finaliza KDS para uma mesa
   * POST /mesas/:id/finalizar-kds
   */
  async finalizarKds(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const resultado = await mesasService.finalizarKds(id);
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao finalizar KDS',
      });
    }
  },

  // ===== CHECKOUT ENDPOINTS =====

  /**
   * Obtém total do checkout
   * GET /mesas/:id/checkout/total
   */
  async obterTotalCheckout(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const total = await mesasService.obterTotalCheckout(id);
      res.status(200).json({ success: true, data: total });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter total',
      });
    }
  },

  /**
   * Finaliza checkout
   * POST /mesas/:id/checkout/finalizar
   * Body: { metodo_pagamento: DINHEIRO|CARTAO|PIX }
   */
  async finalizarCheckout(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { metodo_pagamento } = req.body as { metodo_pagamento: string };

      if (!metodo_pagamento) {
        res.status(400).json({
          success: false,
          message: 'Método de pagamento é obrigatório',
        });
        return;
      }

      const resultado = await mesasService.finalizarCheckout(id, metodo_pagamento);
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao finalizar checkout',
      });
    }
  },

  // ===== HISTÓRICO ENDPOINTS =====

  /**
   * Obtém histórico de comandas
   * GET /mesas/historico/comandas?data_inicio=2024-05-01&data_fim=2024-05-31&mesa_numero=1
   */
  async obterHistoricoComandas(req: Request, res: Response) {
    try {
      const { data_inicio, data_fim, mesa_numero } = req.query as {
        data_inicio?: string;
        data_fim?: string;
        mesa_numero?: string;
      };

      const historico = await mesasService.obterHistoricoComandas(
        data_inicio,
        data_fim,
        mesa_numero ? parseInt(mesa_numero, 10) : undefined,
      );

      res.status(200).json({ success: true, data: historico });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter histórico',
      });
    }
  },
};
