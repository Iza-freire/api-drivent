import hotelsRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';
import { hotelsListingError } from '@/errors/hotels-Listing-Error';

async function getAllowedTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw hotelsListingError();
  }

  return ticket;
}

async function getHotels(userId: number) {
  const ticket = await getAllowedTicket(userId);
  const hotels = await hotelsRepository.findHotels();
  return hotels;
}

export default {
  getHotels,
};
