import { StatusMesa } from '@prisma/client';
import { z } from 'zod';
import { idParamDto } from '../../common/dto/id-param.dto';

export const createMesaDto = z.object({
  numero: z.coerce.number().int('Numero deve ser inteiro.'),
  capacidade: z.coerce.number().int('Capacidade deve ser inteira.').positive('Capacidade deve ser maior que zero.'),
  codigo_mesa: z.coerce.number().int('Codigo da mesa deve ser inteiro.'),
});

export const updateMesaDto = createMesaDto.partial().extend({
  status: z.nativeEnum(StatusMesa).optional(),
  ativa: z.boolean().optional(),
});

export const mesaParamsDto = idParamDto;

// ===== NOVOS DTOs PARA QRCODE E VALIDAÇÃO =====

export const gerarQrCodeMesaDto = z.object({
  mesa_id: z.string().uuid('Mesa ID deve ser um UUID válido'),
  numero: z.number(),
  url_qr: z.string().url(),
  token_acesso: z.string(),
  token_expira_em: z.date(),
  sessao_id: z.string().uuid(),
});

export const verificarAcessoMesaDto = z.object({
  mesa_id: z.string().uuid(),
  token_acesso: z.string(),
});

export const validacaoAcessoMesaDto = z.object({
  valido: z.boolean(),
  mesa_numero: z.number(),
  sessao_id: z.string().uuid(),
  comanda_id: z.string().uuid().optional(),
});

export const statusMesaHardwareDto = z.object({
  id: z.string().uuid(),
  st: z.nativeEnum(StatusMesa), // status abreviado
  tk: z.string(), // token_acesso
  url: z.string().url(),
  num: z.number(),
  cap: z.number(),
  upd: z.date(),
});

export const atualizacaoMesaHardwareDto = z.object({
  numero: z.number(),
  status: z.nativeEnum(StatusMesa),
  token_acesso: z.string(),
  sessao_id: z.string().uuid(),
});

// Exports de tipos TypeScript
export type CreateMesaDto = z.infer<typeof createMesaDto>;
export type UpdateMesaDto = z.infer<typeof updateMesaDto>;
export type MesaParamsDto = z.infer<typeof mesaParamsDto>;
export type GerarQrCodeMesaDto = z.infer<typeof gerarQrCodeMesaDto>;
export type VerificarAcessoMesaDto = z.infer<typeof verificarAcessoMesaDto>;
export type ValidacaoAcessoMesaDto = z.infer<typeof validacaoAcessoMesaDto>;
export type StatusMesaHardwareDto = z.infer<typeof statusMesaHardwareDto>;
export type AtualizacaoMesaHardwareDto = z.infer<typeof atualizacaoMesaHardwareDto>;
