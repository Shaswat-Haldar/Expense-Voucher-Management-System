import React from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';

const StatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-500 text-white';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full shadow-sm tracking-wide ${colorClass}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
