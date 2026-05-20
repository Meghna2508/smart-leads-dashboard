import React from 'react';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, totalPages, total, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginTop: 20, padding: '0 4px',
    }}>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        Page <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong> —{' '}
        {total} leads total
      </p>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn btn-secondary btn-sm"
          style={{ padding: '7px 12px' }}
        >← Prev</button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              width: 34, height: 34, borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: '1px solid',
              borderColor: p === page ? 'var(--accent)' : 'var(--border)',
              background: p === page ? 'var(--accent)' : 'var(--bg-secondary)',
              color: p === page ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >{p}</button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn btn-secondary btn-sm"
          style={{ padding: '7px 12px' }}
        >Next →</button>
      </div>
    </div>
  );
};

export default Pagination;