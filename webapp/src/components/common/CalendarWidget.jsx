import { useState } from 'react';
import { RiCalendarLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import '../../styles/calendarWidget.css';


const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarWidget({ onRangeSelect }) {
    const today = new Date();
    const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [picking, setPicking] = useState('start'); // 'start' | 'end'

    const getDays = () => {
        const first = new Date(view.y, view.m, 1).getDay();
        const total = new Date(view.y, view.m + 1, 0).getDate();
        const empties = Array(first).fill(null);
        const days = Array.from({ length: total }, (_, i) => i + 1);
        return [...empties, ...days];
    };

    const isSameDate = (d1, d2) => d1 && d2 && d1.toDateString() === d2.toDateString();
    const inRange = (day) => {
        if (!start || !end || !day) return false;
        const d = new Date(view.y, view.m, day);
        return d > start && d < end;
    };

    const handleDay = (day) => {
        if (!day) return;
        const d = new Date(view.y, view.m, day);
        if (picking === 'start' || (start && d < start)) {
            setStart(d); setEnd(null); setPicking('end');
        } else {
            setEnd(d); setPicking('start');
        }
    };

    const handleApply = () => {
        if (start && end && onRangeSelect) {
            onRangeSelect({ start: start.toISOString(), end: end.toISOString() });
        }
    };

    const handleClear = () => {
        setStart(null); setEnd(null); setPicking('start');
        if (onRangeSelect) onRangeSelect(null);
    };

    const prevMonth = () => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 });
    const nextMonth = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 });

    const fmt = (d) => d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

    return (
        <div className="calendar-widget">
            <div className="calendar-title"><RiCalendarLine size={14} /> Browse by Date</div>

            <div className="calendar-header">
                <button className="cal-nav" onClick={prevMonth}><RiArrowLeftSLine size={14} /></button>
                <div className="calendar-month-label">{MONTHS[view.m]} {view.y}</div>
                <button className="cal-nav" onClick={nextMonth}><RiArrowRightSLine size={14} /></button>
            </div>

            <div className="calendar-grid">
                {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
                {getDays().map((day, i) => {
                    if (!day) return <div key={`e-${i}`} className="cal-day empty" />;
                    const d = new Date(view.y, view.m, day);
                    const isToday = isSameDate(d, today);
                    const isStart = isSameDate(d, start);
                    const isEnd = isSameDate(d, end);
                    const isInRange = inRange(day);
                    const cls = [
                        'cal-day',
                        isToday ? 'today' : '',
                        (isStart || isEnd) ? `selected ${isStart ? 'start' : 'end'}` : '',
                        isInRange ? 'in-range' : '',
                    ].filter(Boolean).join(' ');
                    return (
                        <div key={day} className={cls} onClick={() => handleDay(day)}>{day}</div>
                    );
                })}
            </div>

            {(start || end) && (
                <div className="calendar-selected-range">
                    📅 {start ? fmt(start) : '?'} — {end ? fmt(end) : 'pick end date'}
                </div>
            )}

            {start && end && (
                <div className="calendar-actions">
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={handleApply}>
                        Show Posts
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={handleClear}>
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}