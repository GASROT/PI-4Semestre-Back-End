import { prisma } from '../../config/prisma';
import { mesasService } from '../mesas/mesas.service';
import { StatusMesa, TipoEvento } from '@prisma/client';

export const hardwareService = {
  /**
   * Obtém status de uma mesa formatado para ESP32
   * Dados compactos para minimizar tráfego
   */
  async obterStatusMesa(numero: number) {
    return mesasService.obterStatusMesaParaHardware(numero);
  },

  /**
   * Registra um novo device (ESP32) vinculado a uma mesa
   */
  async registrarDevice(mesa_id: string, device_id: string) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { id: true },
    });

    if (!mesa) throw new Error('Mesa não encontrada');

    await mesasService.registrarDeviceHardware(mesa_id, device_id);

    return {
      success: true,
      message: 'Device registrado',
      mesa_id,
      device_id,
    };
  },

  /**
   * Processa evento enviado pelo hardware
   * Chamar garçom, limpeza concluída, etc.
   */
  async processarEventoHardware(
    mesa_id: string,
    device_id: string,
    tipo: TipoEvento,
  ) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { id: true, status: true },
    });

    if (!mesa) throw new Error('Mesa não encontrada');

    // Registrar evento
    await mesasService.registrarEvento(mesa_id, tipo, `Evento do hardware: ${tipo}`, device_id);

    // Executar ação baseada no tipo de evento
    switch (tipo) {
      case TipoEvento.CHAMAR_GARCOM:
        // Garçom chamado - mesa permanece em OCUPADA
        break;

      case TipoEvento.LIMPEZA_CONCLUIDA:
        // Limpeza concluída - mesa fica DISPONIVEL
        await mesasService.definirStatusMesa(mesa_id, StatusMesa.DISPONIVEL);
        break;

      case TipoEvento.LIMPEZA_INICIADA:
        // Limpeza iniciada - mesa em MANUTENCAO
        await mesasService.definirStatusMesa(mesa_id, StatusMesa.MANUTENCAO);
        break;

      default:
        break;
    }

    return {
      success: true,
      message: `Evento ${tipo} processado`,
      mesa_id,
      device_id,
    };
  },

  /**
   * Lista eventos recentes de uma mesa para o hardware
   * Limite de 20 últimos eventos
   */
  async listarEventosRecentes(mesa_id: string) {
    return prisma.eventoMesa.findMany({
      where: { mesa_id },
      orderBy: { criado_em: 'desc' },
      take: 20,
      select: {
        id: true,
        tipo: true,
        descricao: true,
        criado_em: true,
      },
    });
  },

  /**
   * Valida se um device está registrado em uma mesa
   */
  async validarDevice(mesa_id: string, device_id: string): Promise<boolean> {
    const mesa = await prisma.mesa.findUnique({
      where: { id: mesa_id },
      select: { device_id: true },
    });

    return mesa?.device_id === device_id;
  },

  /**
   * Desregistra um device de uma mesa
   */
  async desregistrarDevice(mesa_id: string) {
    return prisma.mesa.update({
      where: { id: mesa_id },
      data: { device_id: null },
    });
  },
};
