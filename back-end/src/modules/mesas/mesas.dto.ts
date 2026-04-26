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

export type CreateMesaDto = z.infer<typeof createMesaDto>;
export type UpdateMesaDto = z.infer<typeof updateMesaDto>;
export type MesaParamsDto = z.infer<typeof mesaParamsDto>;
