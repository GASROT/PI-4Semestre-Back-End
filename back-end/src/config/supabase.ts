import { createClient } from '@supabase/supabase-js';
import { env } from './env';

const hasAuthEnv = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY && env.SUPABASE_SERVICE_ROLE_KEY);

export const supabaseAuthClient = hasAuthEnv
  ? createClient(env.SUPABASE_URL as string, env.SUPABASE_ANON_KEY as string)
  : null;

export const supabaseAdminClient = hasAuthEnv
  ? createClient(env.SUPABASE_URL as string, env.SUPABASE_SERVICE_ROLE_KEY as string)
  : null;
