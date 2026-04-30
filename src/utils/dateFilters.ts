export type DueDateFilter = 'today' | 'next3days' | 'next7days' | 'next15days' | 'next30days' | null;

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getTomorrow = () => {
  const tomorrow = new Date(getToday());
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

export const isTaskDueToday = (dueDate: string | Date | null): boolean => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === getToday().getTime();
};

export const isTaskInNext3Days = (dueDate: string | Date | null): boolean => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  date.setHours(0, 0, 0, 0);
  const today = getToday();
  const in3Days = new Date(today);
  in3Days.setDate(in3Days.getDate() + 3);
  return date >= today && date <= in3Days;
};

export const isTaskInNext7Days = (dueDate: string | Date | null): boolean => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  date.setHours(0, 0, 0, 0);
  const today = getToday();
  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);
  return date >= today && date <= in7Days;
};

export const isTaskInNext15Days = (dueDate: string | Date | null): boolean => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  date.setHours(0, 0, 0, 0);
  const today = getToday();
  const in15Days = new Date(today);
  in15Days.setDate(in15Days.getDate() + 15);
  return date >= today && date <= in15Days;
};

export const isTaskInNext30Days = (dueDate: string | Date | null): boolean => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  date.setHours(0, 0, 0, 0);
  const today = getToday();
  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);
  return date >= today && date <= in30Days;
};

export const filterTaskByDueDate = (
  dueDate: string | Date | null,
  filterType: DueDateFilter
): boolean => {
  if (!filterType) return true;

  switch (filterType) {
    case 'today':
      return isTaskDueToday(dueDate);
    case 'next3days':
      return isTaskInNext3Days(dueDate);
    case 'next7days':
      return isTaskInNext7Days(dueDate);
    case 'next15days':
      return isTaskInNext15Days(dueDate);
    case 'next30days':
      return isTaskInNext30Days(dueDate);
    default:
      return true;
  }
};
