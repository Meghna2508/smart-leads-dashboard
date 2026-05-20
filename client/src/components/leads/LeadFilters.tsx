import React, { useEffect, useState } from 'react';
import { useLeadsStore } from '../../store/leadsStore';

const LeadFilters: React.FC = () => {
  const { filters, setFilter, resetFilters } = useLeadsStore();
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => setFilter('search', searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput, setFilter]);

  const selectStyle: React.CSSProperties = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 13,
    padding: '9px 32px 9px 12px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none' as any,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%239b9a94' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    transition: 'all 0.15s',
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      {/* Search */}
      <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', fontSize: 15, pointerEvents: 'none',
        }}>⌕</span>
        <input
          type="text"
          placeholder="Search name or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-field"
          style={{ paddingLeft: 34, paddingTop: 9, paddingBottom: 9, background: 'var(--bg-primary)' }}
        />
      </div>

      <select style={selectStyle} value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
        <option value="all">All Statuses</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </select>

      <select style={selectStyle} value={filters.source} onChange={(e) => setFilter('source', e.target.value)}>
        <option value="all">All Sources</option>
        <option value="Website">Website</option>
        <option value="Instagram">Instagram</option>
        <option value="Referral">Referral</option>
      </select>

      <select style={selectStyle} value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}>
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      {(filters.search || filters.status !== 'all' || filters.source !== 'all') && (
        <button onClick={resetFilters} style={{
          background: 'var(--red-soft)', color: 'var(--red)',
          border: 'none', borderRadius: 8, padding: '9px 14px',
          fontSize: 13, fontFamily: 'DM Sans, sans-serif',
          cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s',
        }}>
          ✕ Clear
        </button>
      )}
    </div>
  );
};

export default LeadFilters;