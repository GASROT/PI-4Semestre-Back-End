import crypto from 'crypto';

/**
 * Utilitário para gerar e validar tokens de acesso para mesas
 * Responsável por criar tokens com TTL e sessions IDs únicos
 */
export class TokenGenerator {
  private readonly TTL_MINUTOS = 360; // 6 horas
  private readonly TAMANHO_TOKEN = 32;

  /**
   * Gera um novo token com expiração
   * @param mesa_id ID da mesa para a qual o token é gerado
   * @returns Objeto com token e data de expiração
   */
  gerar(mesa_id: string): { token: string; expira_em: Date } {
    const token = crypto.randomBytes(this.TAMANHO_TOKEN).toString('hex');
    const expira_em = new Date();
    expira_em.setMinutes(expira_em.getMinutes() + this.TTL_MINUTOS);

    return { token, expira_em };
  }

  /**
   * Gera um ID de sessão único (UUID)
   * @returns UUID string
   */
  gerarSessaoId(): string {
    return crypto.randomUUID();
  }

  /**
   * Valida se um token é válido
   * Em produção, isso consultaria Redis ou o banco de dados
   * Por enquanto, apenas verifica se o token existe
   * @param token Token a validar
   * @param mesa_id ID da mesa (para auditoria)
   * @returns true se válido, false caso contrário
   */
  validar(token: string, mesa_id: string): boolean {
    // TODO: Implementar validação contra Redis ou banco
    // const storedToken = await redis.get(`token:${mesa_id}`);
    // return storedToken === token && !isExpired;

    // Por enquanto, apenas verificar se o token não é vazio
    return !!token && token.length === this.TAMANHO_TOKEN * 2; // 32 bytes = 64 hex chars
  }

  /**
   * Calcula TTL em ms
   */
  getTTLms(): number {
    return this.TTL_MINUTOS * 60 * 1000;
  }

  /**
   * Calcula data de expiração
   */
  gerarDataExpiracao(): Date {
    const data = new Date();
    data.setMinutes(data.getMinutes() + this.TTL_MINUTOS);
    return data;
  }
}

// Instância singleton
export const tokenGenerator = new TokenGenerator();
