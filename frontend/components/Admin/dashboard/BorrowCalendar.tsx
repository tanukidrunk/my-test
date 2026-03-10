'use client';
import { useEffect, useMemo, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  BookOpen, 
  User, 
  CalendarDays, 
  RotateCcw, 
  ArrowRightLeft,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Borrowed, formatDate } from './borrowedTypes';

type Props = { borrowed: Borrowed[] };

// กำหนด Type สำหรับ Props ของ CalendarDay
interface CalendarDayProps {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  loanCount: number;
  returnCount: number;
  onClick: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS   = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

/* ── Day detail modal ── */
function DayModal({ date, records, onClose }: { date: Date; records: Borrowed[]; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 220);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={close}>
      <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden
          transition-all duration-300 ease-out
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center ring-8 ring-blue-50/50">
              <CalendarDays size={20} strokeWidth={2} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm tracking-tight">
                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {records.length} Activities
              </div>
            </div>
          </div>
          <button onClick={close} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 pb-8 pt-2 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-medium">No records for this day</div>
          ) : (
            records.map((b, i) => {
              const isLoan   = isSameDay(new Date(b.loanDate), date);
              const isReturn = b.returnDate && isSameDay(new Date(b.returnDate), date);
              return (
                <div
                  key={b.id}
                  className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                    {String(b.memberId).slice(-2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <User size={12} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-900">Member {b.memberId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <BookOpen size={12} className="text-blue-500" />
                      <span className="text-xs font-medium text-slate-600 truncate">{b.book.title}</span>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      {isLoan && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">
                          <ArrowRightLeft size={10} strokeWidth={2.5} /> Loaned
                        </span>
                      )}
                      {isReturn && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide">
                          <RotateCcw size={10} strokeWidth={2.5} /> Returned
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 tabular-nums uppercase">#{String(b.id).padStart(4, '0')}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Calendar cell ── */
function CalendarDay({ day, isCurrentMonth, isToday, loanCount, returnCount, onClick }: CalendarDayProps) {
  const hasActivity = loanCount > 0 || returnCount > 0;
  return (
    <button
      onClick={onClick}
      className={`
        relative min-h-[90px] p-3 text-left flex flex-col gap-1.5 transition-all
        ${isToday ? 'bg-blue-50/60' : isCurrentMonth ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/40'}
        ${hasActivity && isCurrentMonth ? 'cursor-pointer group' : 'cursor-default'}
      `}
    >
      <span className={`text-[10px] font-bold self-end ${isToday ? 'text-blue-600' : isCurrentMonth ? 'text-slate-600' : 'text-slate-300'}`}>
        {day.getDate()}
      </span>
      {isCurrentMonth && (
        <div className="mt-auto space-y-1">
          {loanCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-[9px] font-bold text-blue-600/80 uppercase truncate">{loanCount} L</span>
            </div>
          )}
          {returnCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-bold text-emerald-600/80 uppercase truncate">{returnCount} R</span>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

/* ── Main calendar ── */
export default function BorrowCalendar({ borrowed }: Props) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<Borrowed[]>([]);

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev  = new Date(year, month, 0).getDate();
    const grid: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--)
      grid.push({ date: new Date(year, month - 1, daysInPrev - i), isCurrentMonth: false });
    for (let d = 1; d <= daysInMonth; d++)
      grid.push({ date: new Date(year, month, d), isCurrentMonth: true });
    while (grid.length % 7 !== 0)
      grid.push({ date: new Date(year, month + 1, grid.length - daysInMonth - firstDay + 1), isCurrentMonth: false });
    return grid;
  }, [year, month]);

  const activityMap = useMemo(() => {
    const map = new Map<string, { loans: Borrowed[]; returns: Borrowed[] }>();
    const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    borrowed.forEach((b) => {
      const lk = key(new Date(b.loanDate));
      if (!map.has(lk)) map.set(lk, { loans: [], returns: [] });
      map.get(lk)!.loans.push(b);
      if (b.returnDate) {
        const rk = key(new Date(b.returnDate));
        if (!map.has(rk)) map.set(rk, { loans: [], returns: [] });
        map.get(rk)!.returns.push(b);
      }
    });
    return map;
  }, [borrowed]);

  const getActivity = (d: Date) => {
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    return activityMap.get(k) ?? { loans: [], returns: [] };
  };

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); };

  const handleDayClick = (date: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const { loans, returns } = getActivity(date);
    const all = [...loans, ...returns.filter(r => !loans.find(l => l.id === r.id))];
    if (all.length === 0) return;
    setSelectedDate(date);
    setSelectedRecords(all);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-xl">
            <CalendarIcon size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm tracking-tight">Activity Calendar</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Click any active day for details</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Loans
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Returns
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={prev} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all">
              <ChevronLeft size={16} strokeWidth={2.5} className="text-slate-600" />
            </button>
            <span className="text-xs font-bold text-slate-900 w-32 text-center uppercase tracking-widest tabular-nums">
              {MONTHS[month]} {year}
            </span>
            <button onClick={next} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all">
              <ChevronRight size={16} strokeWidth={2.5} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-100 border-b border-slate-100 p-px">
        {days.map(({ date, isCurrentMonth }, i) => {
          const { loans, returns } = getActivity(date);
          return (
            <CalendarDay
              key={i}
              day={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isSameDay(date, today)}
              loanCount={loans.length}
              returnCount={returns.length}
              onClick={() => handleDayClick(date, isCurrentMonth)}
            />
          );
        })}
      </div>

      <div className="px-6 py-4 bg-slate-50/30 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{borrowed.length} Total Activities</span>
        <button
          onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          Go to Today
        </button>
      </div>

      {selectedDate && (
        <DayModal
          date={selectedDate}
          records={selectedRecords}
          onClose={() => { setSelectedDate(null); setSelectedRecords([]); }}
        />
      )}
    </div>
  );
}