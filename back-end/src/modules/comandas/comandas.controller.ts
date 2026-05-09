import { Request, Response } from 'express';
import { comandasService } from './comandas.service';
import type {
  CriarComandaDto,
  AdicionarProdutoComandaDto,
  FinalizarComandaDto,
  CancelarComandaDto,
} from './comandas.dto';

export const comandasController = {
  /**
   * Cria uma nova comanda
   * POST /comandas
   */
  async criar(req: Request, res: Response) {
    try {
      const { mesa_id, usuario_id } = req.body as CriarComandaDto;

      if (!mesa_id) {
        res.status(400).json({
          success: false,
          message: 'mesa_id é obrigatório',
        });
        return;
      }

      const comanda = await comandasService.criarComanda(mesa_id, usuario_id);
      res.status(201).json({ success: true, data: comanda });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar comanda',
      });
    }
  },

  /**
   * Obtém comanda ativa de uma mesa
   * GET /comandas/mesa/:mesa_id/ativa
   */
  async obterComandaAtivaByMesa(req: Request, res: Response) {
    try {
      const { mesa_id } = req.params as { mesa_id: string };

      const comanda = await comandasService.obterComandaAtivaByMesa(mesa_id);

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
   * Obtém uma comanda pelo ID
   * GET /comandas/:id
   */
  async obterPorId(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      const comanda = await comandasService.obterPorId(id);

      if (!comanda) {
        res.status(404).json({
          success: false,
          message: 'Comanda não encontrada',
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
   * Adiciona um produto à comanda (cria item de pedido)
   * POST /comandas/:comanda_id/produtos
   */
  async adicionarProduto(req: Request, res: Response) {
    try {
      const { comanda_id } = req.params as { comanda_id: string };
      const { produto_id, quantidade } = req.body as AdicionarProdutoComandaDto;

      if (!produto_id || !quantidade) {
        res.status(400).json({
          success: false,
          message: 'produto_id e quantidade são obrigatórios',
        });
        return;
      }

      const item = await comandasService.adicionarProduto(
        comanda_id,
        produto_id,
        quantidade,
      );

      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao adicionar produto',
      });
    }
  },

  /**
   * Lista pedidos de uma comanda com seus itens
   * GET /comandas/:comanda_id/pedidos
   */
  async listarPedidos(req: Request, res: Response) {
    try {
      const { comanda_id } = req.params as { comanda_id: string };

      const pedidos = await comandasService.listarPedidos(comanda_id);

      res.status(200).json({ success: true, data: pedidos });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao listar pedidos',
      });
    }
  },

  /**
   * Lista itens de um pedido
   * GET /comandas/pedido/:pedido_id/itens
   */
  async listarItensPedido(req: Request, res: Response) {
    try {
      const { pedido_id } = req.params as { pedido_id: string };

      const itens = await comandasService.listarItensPedido(pedido_id);

      res.status(200).json({ success: true, data: itens });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao listar itens',
      });
    }
  },

  /**
   * Remove um item do pedido
   * DELETE /comandas/item/:item_id
   */
  async removerItem(req: Request, res: Response) {
    try {
      const { item_id } = req.params as { item_id: string };

      await comandasService.removerItem(item_id);

      res.status(200).json({ success: true, message: 'Item removido' });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao remover item',
      });
    }
  },

  /**
   * Finaliza uma comanda
   * POST /comandas/:comanda_id/finalizar
   */
  async finalizar(req: Request, res: Response) {
    try {
      const { comanda_id } = req.params as { comanda_id: string };

      const comanda = await comandasService.finalizarComanda(comanda_id);

      res.status(200).json({ success: true, data: comanda });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao finalizar comanda',
      });
    }
  },

  /**
   * Cancela uma comanda
   * POST /comandas/:comanda_id/cancelar
   */
  async cancelar(req: Request, res: Response) {
    try {
      const { comanda_id } = req.params as { comanda_id: string };

      const comanda = await comandasService.cancelarComanda(comanda_id);

      res.status(200).json({ success: true, data: comanda });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao cancelar comanda',
      });
    }
  },

  /**
   * Obtém histórico de comandas de uma mesa
   * GET /comandas/mesa/:mesa_id/historico
   */
  async historicoByMesa(req: Request, res: Response) {
    try {
      const { mesa_id } = req.params as { mesa_id: string };

      const historico = await comandasService.historicoByMesa(mesa_id);

      res.status(200).json({ success: true, data: historico });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter histórico',
      });
    }
  },

  /**
   * Obtém todas as mesas com comandas abertas
   * GET /comandas/ativas/listar
   */
  async obterMesasComComandasAbertas(req: Request, res: Response) {
    try {
      const mesas = await comandasService.obterMesasComComandasAbertas();

      res.status(200).json({ success: true, data: mesas });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter mesas',
      });
    }
  },
};
