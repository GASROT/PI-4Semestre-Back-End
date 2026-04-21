import type { Role } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { supabaseAdminClient } from '../../config/supabase';
import { badRequest } from '../../utils/http-error';

type CreateUsuarioInput = {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  celular?: string;
  turno?: string;
  roles?: Role[];
};

type UpdateUsuarioInput = Partial<Omit<CreateUsuarioInput, 'roles'>> & {
  roles?: Role[];
  ativo?: boolean;
};

export const usuariosService = {
  async create(data: CreateUsuarioInput) {
    if (supabaseAdminClient) {
      const { error } = await supabaseAdminClient.auth.admin.createUser({
        email: data.email,
        password: data.senha,
        email_confirm: true,
      });

      if (error && !error.message.toLowerCase().includes('already')) {
        throw badRequest(`Falha ao criar usuario no Supabase Auth: ${error.message}`);
      }
    }

    return prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          cpf: data.cpf,
          celular: data.celular,
          turno: data.turno,
        },
      });

      if (data.roles?.length) {
        await tx.usuarioRole.createMany({
          data: data.roles.map((role) => ({
            usuario_id: usuario.id,
            role,
          })),
          skipDuplicates: true,
        });
      }

      return tx.usuario.findUnique({
        where: { id: usuario.id },
        include: { roles: true },
      });
    });
  },

  async list() {
    return prisma.usuario.findMany({
      include: { roles: true },
      orderBy: { criado_em: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      include: { roles: true, mesas: true },
    });
  },

  async update(id: string, data: UpdateUsuarioInput) {
    return prisma.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id },
        data: {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          cpf: data.cpf,
          celular: data.celular,
          turno: data.turno,
          ativo: data.ativo,
        },
      });

      if (data.roles) {
        await tx.usuarioRole.deleteMany({ where: { usuario_id: id } });
        if (data.roles.length) {
          await tx.usuarioRole.createMany({
            data: data.roles.map((role) => ({ usuario_id: id, role })),
            skipDuplicates: true,
          });
        }
      }

      return tx.usuario.findUnique({
        where: { id },
        include: { roles: true },
      });
    });
  },

  async deactivate(id: string) {
    return prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });
  },
};
