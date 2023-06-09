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

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentWithAddress) {
    throw cannotBookRoomError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentWithAddress.id);

  if (!ticket || ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookRoomError();
  }
  const userBooking = await bookingRepository.findBookingById(bookingId);

  if (!userBooking || userBooking.userId !== userId) {
    throw cannotBookRoomError();
  }

  const room = await roomRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  const roomBookings = await bookingRepository.findBookingRommId(roomId);

  if (room.capacity <= roomBookings.length) {
    throw cannotBookRoomError();
  }

  const updatedBooking = await bookingRepository.updateBooking(userBooking.id, roomId, userId);

  return updatedBooking;
}

const bookingService = {
  getBooking,
  postCreateBooking,
  updateBooking,
};

export default bookingService;
