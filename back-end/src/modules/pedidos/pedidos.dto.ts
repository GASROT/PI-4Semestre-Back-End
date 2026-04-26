import { StatusPagamento, StatusPreparo } from '@prisma/client';
import { z } from 'zod';
import { idParamDto } from '../../common/dto/id-param.dto';

export const createPedidoDto = z.object({
  mesa_id: z.string().uuid('Mesa invalida.'),
  num_pedido: z.coerce.number().int('Numero do pedido deve ser inteiro.').positive('Numero do pedido deve ser maior que zero.'),
});

export const addItemPedidoDto = z.object({
  produto_id: z.string().uuid('Produto invalido.'),
  quantidade: z.coerce.number().positive('Quantidade deve ser maior que zero.'),
  num_item: z.coerce.number().int('Numero do item deve ser inteiro.').positive('Numero do item deve ser maior que zero.').optional(),
});

export const updateStatusPedidoDto = z.object({
  status_preparo: z.nativeEnum(StatusPreparo).optional(),
  status_pagamento: z.nativeEnum(StatusPagamento).optional(),
});

export const pedidoParamsDto = idParamDto;

export type CreatePedidoDto = z.infer<typeof createPedidoDto>;
export type AddItemPedidoDto = z.infer<typeof addItemPedidoDto>;
export type UpdateStatusPedidoDto = z.infer<typeof updateStatusPedidoDto>;
export type PedidoParamsDto = z.infer<typeof pedidoParamsDto>;
