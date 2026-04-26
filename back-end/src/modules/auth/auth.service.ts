import { supabaseAuthClient } from '../../config/supabase';
import { badRequest, unauthorized } from '../../utils/http-error';

export const authService = {
  async login(email: string, senha: string) {
    if (!supabaseAuthClient) {
      throw badRequest('Supabase nao configurado para autenticacao.');
    }

    const { data, error } = await supabaseAuthClient.auth.signInWithPassword({ email, password: senha });

    if (error || !data.session) {
      throw unauthorized('Credenciais invalidas.');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    };
  },

  async me(token: string) {
    if (!supabaseAuthClient) {
      throw badRequest('Supabase nao configurado para autenticacao.');
    }

    const { data, error } = await supabaseAuthClient.auth.getUser(token);
    if (error || !data.user) {
      throw unauthorized('Token invalido.');
    }

    return data.user;
  },
};
