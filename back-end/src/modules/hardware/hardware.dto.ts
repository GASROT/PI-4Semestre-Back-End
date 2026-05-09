import { StatusMesa, TipoEvento } from '@prisma/client';
import { z } from 'zod';

export const statusMesaHardwareDto = z.object({
  id: z.string().uuid(),
  st: z.nativeEnum(StatusMesa),
  tk: z.string(),
  url: z.string(),
  num: z.number(),
  cap: z.number(),
  upd: z.date(),
});

export const eventoHardwareDto = z.object({
  mesa_id: z.string().uuid(),
  device_id: z.string(),
  tipo: z.nativeEnum(TipoEvento),
  timestamp: z.date(),
});

export const registroDeviceDto = z.object({
  mesa_id: z.string().uuid(),
  device_id: z.string(),
});

export const processarEventoHardwareDto = z.object({
  mesa_id: z.string().uuid(),
  device_id: z.string(),
  tipo: z.nativeEnum(TipoEvento),
});

export type StatusMesaHardwareDto = z.infer<typeof statusMesaHardwareDto>;
export type EventoHardwareDto = z.infer<typeof eventoHardwareDto>;
export type RegistroDeviceDto = z.infer<typeof registroDeviceDto>;
export type ProcessarEventoHardwareDto = z.infer<typeof processarEventoHardwareDto>;
