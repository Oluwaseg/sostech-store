import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './configs/passport';
import { specs, swaggerUi } from './configs/swagger';
import logger, { generateRequestId } from './libs/logger';
import { errorHandler } from './middlewares/error-handler';
import { globalRateLimiter } from './middlewares/rateLimiter';
import apiResponse from './middlewares/response';
import routes from './routes';
import cartService from './services/cart.service';
import productService from './services/product.service';

// Load environment variables FIRST
dotenv.config();

// Now import and validate config after dotenv is loaded
import { config } from './configs/config';

// Validate config on startup
const validatedConfig = config;

const app = express();

// Trust proxy (for ngrok, nginx, etc.)
app.set('trust proxy', 1);

const corsOrigin = validatedConfig.CORS_ORIGIN.split(',').map((origin) =>
  origin.trim()
);

// Request ID middleware
app.use((req: Request, res: Response, next) => {
  (res as any).requestId = generateRequestId();
  next();
});

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
      const request = req as any;
      if (request.originalUrl?.includes('/webhook/paystack')) {
        request.rawBody = buf.toString('utf8');
      }
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(globalRateLimiter);

app.use(
  morgan('dev', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

app.use(apiResponse);

// Initialize passport
app.use(passport.initialize());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Healthcheck route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (_req: Request, res: Response) => res.send('Server is up'));

app.use('/api', routes);

// 404 handler - use middleware without path to catch all unmatched routes
app.use((_req: Request, res: Response) => {
  return (res as any).error('Route not found', 'NOT_FOUND', 404);
});

app.use(errorHandler);

const runStartupMaintenance = async () => {
  try {
    const abandoned = await cartService.cleanupStaleCarts();
    if (abandoned.cleared) {
      logger.info(
        `Cleaned up ${abandoned.cleared} abandoned carts older than 7 days`
      );
    }

    const lowStockProducts = await productService.getLowStockProducts(10);
    if (lowStockProducts.length) {
      logger.warn(
        `Low stock alert: ${lowStockProducts.length} products at or below threshold`,
        {
          products: lowStockProducts.map((product) => ({
            id: product._id,
            name: product.name,
            stock: product.stock,
          })),
        }
      );
    }
  } catch (error: any) {
    logger.error('Startup maintenance task failed', {
      error: error.message || error,
    });
  }
};

runStartupMaintenance();
setInterval(
  () => {
    runStartupMaintenance();
  },
  24 * 60 * 60 * 1000
);

export default app;
