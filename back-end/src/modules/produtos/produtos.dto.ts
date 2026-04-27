import { z } from 'zod';
import { idParamDto } from '../../common/dto/id-param.dto';

export const createProdutoDto = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio.'),
  preco_unitario: z.coerce.number().nonnegative('Preco unitario deve ser maior ou igual a zero.'),
  qtd_estoque: z.coerce.number().nonnegative('Quantidade em estoque deve ser maior ou igual a zero.'),
});

export const updateProdutoDto = createProdutoDto.partial();

export const produtoParamsDto = idParamDto;

export type CreateProdutoDto = z.infer<typeof createProdutoDto>;
export type UpdateProdutoDto = z.infer<typeof updateProdutoDto>;
export type ProdutoParamsDto = z.infer<typeof produtoParamsDto>;
