import { prisma } from '@/config';

async function findBookingById(id: number) {
  return prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      Room: true,
    },
  });
}

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}
const bookingRepository = {
  findBookingById,
  findBookingByUserId,
};

export default bookingRepository;
