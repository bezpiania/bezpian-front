import React, { useMemo } from 'react';
import { getHourRange, groupByDay, resourceColor, fmt } from './calendarUtils.js';
import AppointmentBlock from './AppointmentBlock.jsx';

const HOUR_HEIGHT = 64; // px per hour

const CalendarGrid = ({ days, appointments, resourceMap, onAppointmentClick }) => {
  const hours = useMemo(() => getHourRange(appointments), [appointments]);
  const byDay = useMemo(() => groupByDay(appointments), [appointments]);
  const totalHeight = hours.length * HOUR_HEIGHT;

  // Build resource index map for consistent colors
  const resourceIndexMap = useMemo(() => {
    const m = {};
    let i = 0;
    for (const id of Object.keys(resourceMap)) { m[id] = i++; }
    return m;
  }, [resourceMap]);

  const getAppointmentStyle = (apt) => {
    const start = new Date(apt.scheduledAt || apt.startTime);
    const startDecimal = start.getHours() + start.getMinutes() / 60;
    const durationH = (apt.durationMinutes || 60) / 60;
    const top = (startDecimal - hours[0]) * HOUR_HEIGHT;
    const height = Math.max(28, durationH * HOUR_HEIGHT - 4);
    return { top, height };
  };

  // Detect overlaps within a day column
  const resolveStacks = (dayAppointments) => {
    const sorted = [...dayAppointments].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    const stacks = []; // array of groups

    for (const apt of sorted) {
      const start = new Date(apt.scheduledAt).getTime();
      const end = start + (apt.durationMinutes || 60) * 60000;
      let placed = false;

      for (const stack of stacks) {
        const lastEnd = Math.max(...stack.map(a => new Date(a.scheduledAt).getTime() + (a.durationMinutes || 60) * 60000));
        if (start >= lastEnd) {
          stack.push(apt);
          placed = true;
          break;
        }
      }
      if (!placed) stacks.push([apt]);
    }

    // Flatten with stack metadata
    const result = [];
    const totalStacks = stacks.length;
    stacks.forEach((stack, stackIdx) => {
      stack.forEach(apt => result.push({ apt, stackIndex: stackIdx, stackTotal: totalStacks }));
    });
    return result;
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `44px repeat(${days.length}, 1fr)`, minWidth: 0, width: '100%' }}>

        {/* Hour labels column */}
        <div style={{ position: 'relative', height: totalHeight, borderRight: '1px solid var(--rule)' }}>
          {hours.map((h, i) => (
            <div key={h} style={{ position: 'absolute', top: i * HOUR_HEIGHT, height: HOUR_HEIGHT, width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: 8, paddingTop: 4, boxSizing: 'border-box' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.05em', opacity: 0.4 }}>
                {`${h.toString().padStart(2, '0')}:00`}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day) => {
          const dayKey = day.date.toDateString();
          const dayApts = byDay[dayKey] || [];
          const stacked = resolveStacks(dayApts);

          return (
            <div key={dayKey} style={{ position: 'relative', height: totalHeight, borderLeft: '1px solid var(--rule)', background: day.isToday ? 'rgba(220,255,30,0.03)' : 'transparent' }}>
              {/* Hour grid lines */}
              {hours.map((h, i) => (
                <div key={h} style={{ position: 'absolute', top: i * HOUR_HEIGHT, left: 0, right: 0, borderTop: `1px solid var(--rule)`, opacity: 0.5 }} />
              ))}

              {/* Weekend hatch */}
              {day.isWeekend && (
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, var(--rule) 6px, var(--rule) 7px)', pointerEvents: 'none' }} />
              )}

              {/* Appointments */}
              {stacked.map(({ apt, stackIndex, stackTotal }) => {
                const { top, height } = getAppointmentStyle(apt);
                const ridx = resourceIndexMap[apt.resourceId?.toString()] ?? 0;
                const color = resourceColor(apt.resourceId, ridx);
                return (
                  <AppointmentBlock
                    key={apt._id}
                    appointment={{ ...apt, resourceName: resourceMap[apt.resourceId?.toString()]?.name }}
                    color={color}
                    top={top}
                    height={height}
                    stackIndex={stackIndex}
                    stackTotal={stackTotal}
                    onClick={onAppointmentClick}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
