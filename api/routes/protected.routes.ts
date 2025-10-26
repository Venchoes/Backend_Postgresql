import { Router } from 'express';
import { protectedRouteHandler } from '../controllers/protected.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, protectedRouteHandler);

export default router;