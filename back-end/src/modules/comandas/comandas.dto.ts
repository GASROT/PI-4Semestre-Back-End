import { ComandaStatus } from '@prisma/client';
import { z } from 'zod';

export const criarComandaDto = z.object({
  mesa_id: z.string().uuid(),
  usuario_id: z.string().uuid().optional(),
});

export const adicionarProdutoComandaDto = z.object({
  produto_id: z.string().uuid(),
  quantidade: z.coerce.number().int().positive('Quantidade deve ser positiva'),
});

export const finalizarComandaDto = z.object({
  metodo_pagamento: z.enum(['DINHEIRO', 'CARTAO', 'PIX']),
});

export const cancelarComandaDto = z.object({
  motivo: z.string().optional(),
});

export type CriarComandaDto = z.infer<typeof criarComandaDto>;
export type AdicionarProdutoComandaDto = z.infer<typeof adicionarProdutoComandaDto>;
export type FinalizarComandaDto = z.infer<typeof finalizarComandaDto>;
export type CancelarComandaDto = z.infer<typeof cancelarComandaDto>;
