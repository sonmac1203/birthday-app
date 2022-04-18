import { differenceInCalendarDays } from 'date-fns';

export const appendYear = (date) => {
  const year = date.slice(-4);
  return date.replace(year, new Date().getFullYear());
};

export const isSameDay = (a, b) => {
  return differenceInCalendarDays(a, b) === 0;
};
