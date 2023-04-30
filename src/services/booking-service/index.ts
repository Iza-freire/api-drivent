import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    return null;
  }
  return { id: booking.id, Room: booking.Room };
}

const bookingService = {
  getBooking,
};

export default bookingService;
