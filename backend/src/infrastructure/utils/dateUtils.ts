export function isPastDate(date: Date | string): boolean {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(parsedDate.getTime())) {
    return false;
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  today.setHours(0, 0, 0, 0);
  
  const dateToCheck = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  dateToCheck.setHours(0, 0, 0, 0);
  
  return dateToCheck.getTime() < today.getTime();
}

export function isTodayOrFuture(date: Date | string): boolean {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(parsedDate.getTime())) {
    return false;
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  today.setHours(0, 0, 0, 0);
  
  const dateToCheck = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  dateToCheck.setHours(0, 0, 0, 0);
  
  return dateToCheck.getTime() >= today.getTime();
}
