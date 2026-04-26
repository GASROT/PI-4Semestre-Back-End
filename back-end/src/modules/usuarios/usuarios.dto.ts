import { Role } from '@prisma/client';
import { z } from 'zod';
import { idParamDto } from '../../common/dto/id-param.dto';

const roleDto = z.nativeEnum(Role);

export const createUsuarioDto = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio.'),
  email: z.string().trim().email('Email invalido.'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
  cpf: z.string().trim().min(1).optional(),
  celular: z.string().trim().min(1).optional(),
  turno: z.string().trim().min(1).optional(),
  roles: z.array(roleDto).optional(),
});

export const updateUsuarioDto = createUsuarioDto.partial().extend({
  ativo: z.boolean().optional(),
  roles: z.array(roleDto).optional(),
});

export const usuarioParamsDto = idParamDto;

export type CreateUsuarioDto = z.infer<typeof createUsuarioDto>;
export type UpdateUsuarioDto = z.infer<typeof updateUsuarioDto>;
export type UsuarioParamsDto = z.infer<typeof usuarioParamsDto>;
