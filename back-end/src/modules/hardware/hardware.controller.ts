import { Request, Response } from 'express';
import { hardwareService } from './hardware.service';
import { TipoEvento } from '@prisma/client';

export const hardwareController = {
  /**
   * Retorna status ultra-leve da mesa para ESP32
   * GET /hardware/mesa/:numero/status
   */
  async obterStatusMesa(req: Request, res: Response) {
    try {
      const { numero } = req.params as { numero: string };
      const status = await hardwareService.obterStatusMesa(parseInt(numero, 10));

      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter status',
      });
    }
  },

  /**
   * Registra um novo device no sistema
   * POST /hardware/device/register
   */
  async registrarDevice(req: Request, res: Response) {
    try {
      const { mesa_id, device_id } = req.body as { mesa_id: string; device_id: string };

      if (!mesa_id || !device_id) {
        res.status(400).json({
          success: false,
          message: 'mesa_id e device_id são obrigatórios',
        });
        return;
      }

      const resultado = await hardwareService.registrarDevice(mesa_id, device_id);
      res.status(201).json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao registrar device',
      });
    }
  },

  /**
   * Processa evento do hardware
   * POST /hardware/mesa/:mesa_id/evento
   */
  async processarEvento(req: Request, res: Response) {
    try {
      const { mesa_id } = req.params as { mesa_id: string };
      const { device_id, tipo } = req.body as { device_id: string; tipo: TipoEvento };

      if (!mesa_id || !device_id || !tipo) {
        res.status(400).json({
          success: false,
          message: 'mesa_id, device_id e tipo são obrigatórios',
        });
        return;
      }

      const resultado = await hardwareService.processarEventoHardware(
        mesa_id,
        device_id,
        tipo,
      );

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao processar evento',
      });
    }
  },

  /**
   * Lista eventos recentes da mesa
   * GET /hardware/mesa/:mesa_id/eventos
   */
  async listarEventos(req: Request, res: Response) {
    try {
      const { mesa_id } = req.params as { mesa_id: string };
      const eventos = await hardwareService.listarEventosRecentes(mesa_id);

      res.status(200).json({ success: true, data: eventos });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao listar eventos',
      });
    }
  },

  /**
   * Desregistra device
   * POST /hardware/device/:mesa_id/unregister
   */
  async desregistrarDevice(req: Request, res: Response) {
    try {
      const { mesa_id } = req.params as { mesa_id: string };
      await hardwareService.desregistrarDevice(mesa_id);

      res.status(200).json({
        success: true,
        message: 'Device desregistrado',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao desregistrar',
      });
    }
  },
};
