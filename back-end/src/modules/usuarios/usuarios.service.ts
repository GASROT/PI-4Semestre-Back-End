import { supabaseAdminClient } from '../../config/supabase';
import { badRequest } from '../../utils/http-error';
import type { CreateUsuarioDto, UpdateUsuarioDto } from './usuarios.dto';
import { usuariosRepository } from '../../repositories/usuarios.repository';

export const usuariosService = {
  async create(data: CreateUsuarioDto) {
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

    return usuariosRepository.create(data);
  },

  async list() {
    return usuariosRepository.list();
  },

  async getById(id: string) {
    return usuariosRepository.findById(id);
  },

  async update(id: string, data: UpdateUsuarioDto) {
    return usuariosRepository.update(id, data);
  },

  async deactivate(id: string) {
    return usuariosRepository.deactivate(id);
  },
};
