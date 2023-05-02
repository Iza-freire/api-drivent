import { notFoundError, cannotBookRoomError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomRepository from '@/repositories/room-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    return null;
  }
  return { id: booking.id, Room: booking.Room };
}
async function postCreateBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw cannotBookRoomError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') {
    throw cannotBookRoomError();
  }

  const room = await roomRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  const bookings = await bookingRepository.findBookingRommId(roomId);

  if (bookings.length >= room.capacity) {
    throw cannotBookRoomError();
  }

  const registerBooking = await bookingRepository.createBooking(roomId, userId);

  return registerBooking.id;
}

async function updateBooking(bookingId: number, roomId: number) {
  const booking = await bookingRepository.findBookingById(bookingId);

  if (!booking) {
    throw notFoundError();
  }

  const room = await roomRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  const bookingsForRoom = await bookingRepository.findBookingRommId(roomId);

  if (bookingsForRoom.some((b) => b.id !== bookingId)) {
    throw cannotBookRoomError();
  }

  const updatedBooking = await bookingRepository.updateBooking(bookingId, roomId);
  return updatedBooking;
}

const bookingService = {
  getBooking,
  postCreateBooking,
  updateBooking,
};

export default bookingService;
