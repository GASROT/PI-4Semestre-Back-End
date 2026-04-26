import { z } from 'zod';
import { idParamDto } from '../../common/dto/id-param.dto';

export const createFornecedorDto = z.object({
  razao_social: z.string().trim().min(1, 'Razao social obrigatoria.'),
  cnpj: z.string().trim().min(1, 'CNPJ obrigatorio.'),
});

export const updateFornecedorDto = createFornecedorDto.partial();

export const fornecedorParamsDto = idParamDto;

export type CreateFornecedorDto = z.infer<typeof createFornecedorDto>;
export type UpdateFornecedorDto = z.infer<typeof updateFornecedorDto>;
export type FornecedorParamsDto = z.infer<typeof fornecedorParamsDto>;
