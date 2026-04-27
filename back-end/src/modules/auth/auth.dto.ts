import { z } from 'zod';

export const loginAuthDto = z.object({
  email: z.string().trim().email('Email invalido.'),
  senha: z.string().min(1, 'Senha obrigatoria.'),
});

export type LoginAuthDto = z.infer<typeof loginAuthDto>;
