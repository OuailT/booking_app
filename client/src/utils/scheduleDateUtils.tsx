// Return the first day of week
export const getStartOfWeek = (d: Date, monday = true) => {
  const x = new Date(d);
  const day = x.getDay();
  const diff = monday ? (day || 7) - 1 : day;
  x.setDate(x.getDate() - diff);
  return x;
};
// Make a list with week days
export const getWeekDays = (date: Date) => {
  const weekStart = getStartOfWeek(date);
  return Array.from({ length: 7 }, (_, i) =>
    new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + i
    )
  );
};
export const addDays = (d: Date, days: number) => {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
}
export const isSameDay = (d1: Date, d2: Date) => {
    if(d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()){
        return true;
    } else {
        return false;
    }
}
// Formatted date (ex Mon 06/04)
export const formattedDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'numeric',
});
// Formatted month (ex Apr)
export const shortMonth = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
});

// Formated date to string YYYY-MM-DD
export const formattedDateToString = (date: Date) => {
  const formattedDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

  return formattedDate;
}