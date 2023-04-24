import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels } from '@/controllers/hotels-controller';

const hotelsRoutes = Router();

hotelsRoutes.all('/*', authenticateToken).get('/', getHotels);

export { hotelsRoutes };
