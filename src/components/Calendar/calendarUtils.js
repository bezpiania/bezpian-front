export const DAYS_SHORT = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

// Colors per resource index — matches design system palette
export const RESOURCE_COLORS = [
  { bg: 'var(--ink)',        text: 'var(--bone)',    border: 'var(--voltage)' },
  { bg: 'var(--magma)',      text: 'var(--bone)',    border: '#ff8c6b' },
  { bg: '#8B5CF6',           text: 'var(--bone)',    border: '#c4b5fd' },
  { bg: '#0891B2',           text: 'var(--bone)',    border: '#67e8f9' },
  { bg: '#059669',           text: 'var(--bone)',    border: '#6ee7b7' },
  { bg: 'var(--carbon)',     text: 'var(--voltage)', border: 'var(--voltage)' },
];

export const STATUS_STYLES = {
  scheduled:  { label: 'Pendiente',   dot: '#F59E0B' },
  confirmed:  { label: 'Confirmada',  dot: 'var(--green)' },
  completed:  { label: 'Completada',  dot: 'var(--ink)' },
  cancelled:  { label: 'Cancelada',   dot: 'var(--magma)' },
  no_show:    { label: 'No asistió',  dot: '#9CA3AF' },
};

/** Returns the 7 days of the week containing the given date (Mon–Sun) */
export function getWeekDays(referenceDate) {
  const d = new Date(referenceDate);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Monday offset
  d.setDate(d.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(d);
    date.setDate(d.getDate() + i);
    return {
      date,
      label: DAYS_SHORT[i],
      num: date.getDate(),
      month: date.toLocaleDateString('es-CL', { month: 'short' }),
      isToday: date.toDateString() === new Date().toDateString(),
      isWeekend: i >= 5,
    };
  });
}

/** Advances date by N weeks */
export function shiftWeek(date, delta) {
  const d = new Date(date);
  d.setDate(d.getDate() + delta * 7);
  return d;
}

/** Format "HH:MM" from a Date */
export function fmt(date) {
  if (!date) return '—';
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

/** Returns all unique hour labels (HH:00) that span the appointments on a given week */
export function getHourRange(appointments, fallbackStart = 9, fallbackEnd = 20) {
  if (!appointments.length) {
    return Array.from({ length: fallbackEnd - fallbackStart }, (_, i) => fallbackStart + i);
  }
  let min = 23, max = 0;
  for (const a of appointments) {
    const h = new Date(a.scheduledAt || a.startTime).getHours();
    const end = new Date(a.endTime || new Date(a.scheduledAt).getTime() + (a.durationMinutes || 60) * 60000).getHours();
    if (h < min) min = h;
    if (end > max) max = end;
  }
  min = Math.max(0, min - 1);
  max = Math.min(23, max + 1);
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

/** Group appointments by day string */
export function groupByDay(appointments) {
  const map = {};
  for (const a of appointments) {
    const key = new Date(a.scheduledAt || a.startTime).toDateString();
    if (!map[key]) map[key] = [];
    map[key].push(a);
  }
  return map;
}

/** Get color for a resource by its id, consistent across renders */
export function resourceColor(resourceId, resourceIndex) {
  return RESOURCE_COLORS[(resourceIndex ?? 0) % RESOURCE_COLORS.length];
}

/** Relative time label */
export function relativeLabel(date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = d - now;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 0) return 'Pasada';
  if (diffMin < 60) return `En ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `En ${diffH}h`;
  return d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
}
