// Return the first day of week
export const startOfWeek = (d: Date, monday = true) => {
  const x = new Date(d);
  const day = x.getDay();
  const diff = monday ? (day || 7) - 1 : day;
  x.setDate(x.getDate() - diff);
  return x;
};
// Make a list with week days
export const getWeekDays = (date: Date) => {
  const weekStart = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) =>
    new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + i
    )
  );
};
// Make formatted date (Mon 06/04)
export const formattedDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'numeric',
});