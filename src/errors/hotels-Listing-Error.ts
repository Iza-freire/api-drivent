import { ApplicationError } from '@/protocols';

export function hotelsListingError(): ApplicationError {
  return {
    name: 'HOTELS_LISTING_ERROR',
    message: 'Cannot list hotels for this ticket',
  };
}
