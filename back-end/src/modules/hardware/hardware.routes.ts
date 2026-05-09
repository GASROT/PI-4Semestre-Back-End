import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { hardwareController } from './hardware.controller';

export const hardwareRouter = Router();

// Rotas para ESP32/Arduino
hardwareRouter.get(
  '/mesa/:numero/status',
  asyncHandler(hardwareController.obterStatusMesa),
);

hardwareRouter.post(
  '/device/register',
  asyncHandler(hardwareController.registrarDevice),
);

hardwareRouter.post(
  '/mesa/:mesa_id/evento',
  asyncHandler(hardwareController.processarEvento),
);

hardwareRouter.get(
  '/mesa/:mesa_id/eventos',
  asyncHandler(hardwareController.listarEventos),
);

hardwareRouter.post(
  '/device/:mesa_id/unregister',
  asyncHandler(hardwareController.desregistrarDevice),
);
