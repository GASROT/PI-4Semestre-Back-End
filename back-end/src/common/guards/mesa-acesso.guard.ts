import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { tokenGenerator } from '../../utils/token-generator';

/**
 * Guard para validar acesso de clientes a uma mesa via token
 * Verifica se o token é válido e não expirou
 * 
 * Uso:
 * router.get('/mesas/:id/comanda', mesaAcessoGuard, controller.obterComanda);
 */
export async function mesaAcessoGuard(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id: mesa_id } = req.params as { id: string };
    const { token } = req.query as { token: string | undefined };

    if (!mesa_id || !token) {
      res.status(400).json({
        erro: 'Mesa ID e token são obrigatórios',
      });
      return;
    }

    // Buscar mesa no banco
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: {
        id: true,
        numero: true,
        status: true,
        token_acesso: true,
        sessao_id: true,
      },
    });

    if (!mesa) {
      res.status(404).json({
        erro: 'Mesa não encontrada',
      });
      return;
    }

    // Validar token
    if (mesa.token_acesso !== token) {
      res.status(401).json({
        erro: 'Token inválido',
      });
      return;
    }

    if (!tokenGenerator.validar(token, mesa_id)) {
      res.status(401).json({
        erro: 'Token expirado ou inválido',
      });
      return;
    }

    // Adicionar dados à request para uso nos controllers
    req.mesa_id = mesa_id;
    req.sessao_id = (mesa.sessao_id as string) || undefined;
    req.token_acesso = token;

    // Buscar comanda ativa se existir
    const comanda = await prisma.comanda.findFirst({
      where: {
        mesa_id: mesa_id as string,
        status: 'ABERTA',
      },
      select: { id: true },
    });

    if (comanda) {
      req.comanda_id = comanda.id;
    }

    next();
  } catch (error) {
    console.error('[mesaAcessoGuard] Erro:', error);
    res.status(500).json({
      erro: 'Erro ao validar acesso',
    });
  }
}

/**
 * Guard alternativo que apenas valida a existência da comanda ativa
 * Mais leve, não valida token
 */
export async function comandaAtivaGuard(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id: mesa_id } = req.params as { id: string };

    if (!mesa_id) {
      res.status(400).json({
        erro: 'Mesa ID é obrigatório',
      });
      return;
    }

    // Buscar comanda ativa
    const comanda = await prisma.comanda.findFirst({
      where: {
        mesa_id,
        status: 'ABERTA',
      },
      select: { id: true },
    });

    if (!comanda) {
      res.status(404).json({
        erro: 'Nenhuma comanda ativa nesta mesa',
      });
      return;
    }

    req.comanda_id = comanda.id;
    req.mesa_id = mesa_id;

    next();
  } catch (error) {
    console.error('[comandaAtivaGuard] Erro:', error);
    res.status(500).json({
      erro: 'Erro ao validar comanda',
    });
  }
}
