import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';
import { requestContextInterceptor } from './interceptors/request-context.interceptor';
import { responseTimingInterceptor } from './interceptors/response-timing.interceptor';
import { apiRouter } from './routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN, credentials: true }));
app.use(requestContextInterceptor);
app.use(responseTimingInterceptor);
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Bar/Restaurante em Node + Express',
  });
});

app.use('/api/v1', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
