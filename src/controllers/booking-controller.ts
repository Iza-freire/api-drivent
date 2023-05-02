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
export async function postCreateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const bookingId = await bookingService.postCreateBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId });
  } catch (error) {
    if (error.name === 'CannotBookRoomError') {
      return res.status(httpStatus.FORBIDDEN).send({ message: error.message });
    }
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body;

  if (!bookingId || isNaN(Number(bookingId)) || !roomId || isNaN(Number(roomId))) {
    res.sendStatus(httpStatus.BAD_REQUEST);
    return;
  }

  try {
    const bookingChange = await bookingService.updateBooking(Number(userId), Number(roomId), Number(bookingId));
    res.status(httpStatus.OK).send({ bookingId: bookingChange.id });
  } catch (error) {
    if (error.name === 'CannotBookRoomError') {
      res.sendStatus(httpStatus.FORBIDDEN);
    } else {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}
