import React from 'react';

interface BadgeProps {
  text: string;
  type: 'status' | 'source';
}

const statusConfig: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  New:       { bg: 'var(--blue-soft)',   color: 'var(--blue)',   dot: 'var(--blue)',   label: 'New' },
  Contacted: { bg: 'var(--yellow-soft)', color: 'var(--yellow)', dot: 'var(--yellow)', label: 'Contacted' },
  Qualified: { bg: 'var(--green-soft)',  color: 'var(--green)',  dot: 'var(--green)',  label: 'Qualified' },
  Lost:      { bg: 'var(--red-soft)',    color: 'var(--red)',    dot: 'var(--red)',    label: 'Lost' },
};

const sourceConfig: Record<string, { bg: string; color: string }> = {
  Website:  { bg: 'var(--purple-soft)', color: 'var(--purple)' },
  Instagram:{ bg: 'var(--pink-soft)',   color: 'var(--pink)' },
  Referral: { bg: 'var(--orange-soft)', color: 'var(--orange)' },
};

const Badge: React.FC<BadgeProps> = ({ text, type }) => {
  if (type === 'status') {
    const cfg = statusConfig[text] || statusConfig['New'];
    return (
      <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
        <span className="status-dot" style={{ background: cfg.dot }} />
        {cfg.label}
      </span>
    );
  }
  const cfg = sourceConfig[text] || sourceConfig['Website'];
  return (
    <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
      {text}
    </span>
  );
};

export default Badge;