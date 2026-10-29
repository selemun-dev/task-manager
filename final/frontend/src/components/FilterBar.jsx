/**
 * FilterBar — filter tasks by status.
 */

const FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

export default function FilterBar({ activeFilter, onChange, counts }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks by status">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`filter-btn ${activeFilter === f.value ? 'active' : ''}`}
          onClick={() => onChange(f.value)}
          aria-pressed={activeFilter === f.value}
        >
          {f.label}
          {counts[f.value] !== undefined && (
            <span className="filter-count">{counts[f.value]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
