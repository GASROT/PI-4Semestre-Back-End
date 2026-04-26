import { z } from 'zod';

export const idParamDto = z.object({
  id: z.string().uuid('Parametro id invalido.'),
});

export type IdParamDto = z.infer<typeof idParamDto>;
