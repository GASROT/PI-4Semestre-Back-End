import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import type { CreateUsuarioDto, UpdateUsuarioDto } from '../modules/usuarios/usuarios.dto';

export const usuariosRepository = {
  async create(data: CreateUsuarioDto) {
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

  list() {
    return prisma.usuario.findMany({
      include: { roles: true },
      orderBy: { criado_em: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      include: { roles: true, mesas: true },
    });
  },

  async update(id: string, data: UpdateUsuarioDto) {
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

  deactivate(id: string) {
    return prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });
  },
};
