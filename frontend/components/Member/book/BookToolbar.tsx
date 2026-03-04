'use client';

type FilterType = 'ALL' | 'AVAILABLE' | 'BORROWED';

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
};

const filters: { value: FilterType; label: string }[] = [
  { value: 'ALL',       label: 'All Books'  },
  { value: 'AVAILABLE', label: '✅ Available' },
  { value: 'BORROWED',  label: '📖 Borrowed' },
];

export default function BookToolbar({ search, onSearchChange, activeFilter, onFilterChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search title, author, category..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
            text-sm text-slate-700 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
            transition-all duration-200
          "
        />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl self-start">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`
              px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeFilter === f.value
                ? 'bg-white text-slate-800 shadow-sm scale-[1.02]'
                : 'text-slate-500 hover:text-slate-700'}
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}