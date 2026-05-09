import type { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startedAt?: bigint;
      auth?: {
        token: string;
        user: User;
      };
      // ===== NOVOS CAMPOS PARA MESAS =====
      mesa_id?: string;
      token_acesso?: string;
      sessao_id?: string;
      comanda_id?: string;
      usuario_id?: string;
      device_id?: string;
    }
  }
}

export {};
