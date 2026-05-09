/**
 * Utilitário para gerar URLs de QR Code e gerenciar dados de QR
 * Responsável por construir URLs que podem ser codificadas em QR Code
 */
export class QrCodeGenerator {
  private readonly BASE_URL: string;

  constructor(baseUrl?: string) {
    this.BASE_URL = baseUrl || process.env.APP_URL || 'http://localhost:3000';
  }

  /**
   * Gera uma URL completa para QR Code de uma mesa
   * Formato: https://app.bar.com.br/m/{numero}?t={token}
   * 
   * @param numero Número da mesa
   * @param token Token de acesso
   * @returns URL completa para ser codificada em QR Code
   */
  gerarUrl(numero: number, token: string): string {
    return `${this.BASE_URL}/m/${numero}?t=${token}`;
  }

  /**
   * Gera uma URL de verificação de status da mesa (para painel administrativo)
   * @param mesa_id ID da mesa
   * @param token Token de acesso
   * @returns URL para validar acesso
   */
  gerarUrlVerificacao(mesa_id: string, token: string): string {
    return `${this.BASE_URL}/api/v1/mesas/${mesa_id}/validar-token?token=${token}`;
  }

  /**
   * Gera uma URL para hardware (ESP32) obter status
   * @param numero Número da mesa
   * @returns URL para GET /hardware/mesa/:numero/status
   */
  gerarUrlHardware(numero: number): string {
    return `${this.BASE_URL}/api/v1/hardware/mesa/${numero}/status`;
  }

  /**
   * Decodifica um token de uma URL de QR Code
   * @param url URL do QR Code
   * @returns Token extraído
   */
  extrairTokenDaUrl(url: string): string | null {
    const match = url.match(/[?&]t=([^&]+)/);
    return match ? match[1] : null;
  }

  /**
   * Decodifica o número da mesa de uma URL de QR Code
   * @param url URL do QR Code
   * @returns Número da mesa
   */
  extrairNumeroDaUrl(url: string): number | null {
    const match = url.match(/\/m\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Valida se uma URL de QR Code é válida
   * @param url URL para validar
   * @returns true se válida
   */
  validarUrl(url: string): boolean {
    const temNumero = /\/m\/\d+/.test(url);
    const temToken = /[?&]t=[^&]+/.test(url);
    return temNumero && temToken;
  }

  /**
   * Gera dados estruturados para exibir QR Code (usar com biblioteca qrcode)
   * @param numero Número da mesa
   * @param token Token de acesso
   * @returns Objeto com dados para gerar QR Code
   */
  gerarDadosQrCode(numero: number, token: string): {
    url: string;
    numero: number;
    token: string;
    timestamp: string;
  } {
    return {
      url: this.gerarUrl(numero, token),
      numero,
      token,
      timestamp: new Date().toISOString(),
    };
  }
}

// Instância singleton
export const qrCodeGenerator = new QrCodeGenerator();
