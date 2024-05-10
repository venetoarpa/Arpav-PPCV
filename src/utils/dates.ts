import { DateTime } from 'luxon';

export const formatYear = (date: string): string => {
  return DateTime.fromISO(date).year.toString();
};
