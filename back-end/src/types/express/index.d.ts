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
    }
  }
}

export {};
