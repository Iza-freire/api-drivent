import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);
    if (!booking) {
      return res.status(httpStatus.NOT_FOUND).send();
    }
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    next(error);
  }
}
