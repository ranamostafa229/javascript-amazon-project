function isWeeknd(day) {
  const dayOfWeek = day.format("dddd");
  return dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
}

export default isWeeknd;
