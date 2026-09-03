import React from 'react';
import { cn } from '../utils';

const steps = [
  { id: 'draft', name: 'Draft' },
  { id: 'pending_approval', name: 'Pending Approval' },
  { id: 'approved', name: 'Approved' },
];

const StatusTimeline = ({ currentStatus }) => {
  const isRejected = currentStatus === 'rejected';
  const currentIndex = isRejected ? 1 : steps.findIndex(s => s.id === currentStatus);

  return (
    <nav aria-label="Progress" className="py-2">
      <ol role="list" className="flex items-center justify-between sm:justify-start max-w-xl mx-auto sm:mx-0">
        {steps.map((step, stepIdx) => {
          const isCurrent = stepIdx === currentIndex;
          const isComplete = stepIdx < currentIndex;
          
          let circleColor = 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-400';
          if (isComplete) circleColor = 'bg-emerald-600 border-emerald-600 text-white';
          if (isCurrent && !isRejected) circleColor = 'border-2 border-amber-500 bg-white dark:bg-slate-900 text-amber-500 ring-4 ring-amber-500/10';
          if (isCurrent && isRejected) circleColor = 'border-2 border-red-600 bg-red-600 text-white ring-4 ring-red-600/10';

          return (
            <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? 'flex-1 pr-4 sm:pr-16 relative' : 'relative', 'flex items-center')}>
              {stepIdx !== steps.length - 1 && (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={cn("h-1 w-full rounded-full transition-colors", isComplete ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800')} />
                </div>
              )}
              <div className="relative flex flex-col items-center group">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all shadow-sm",
                    circleColor
                  )}
                >
                  {isComplete ? (
                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className={cn("h-3 w-3 rounded-full", (isCurrent && !isRejected) ? 'bg-amber-500' : 'bg-transparent')} />
                  )}
                </div>
                <span className={cn(
                  "absolute -bottom-6 w-max text-xs font-semibold whitespace-nowrap",
                  isCurrent && isRejected ? 'text-red-600 dark:text-red-400' : 
                  isCurrent ? 'text-amber-600 dark:text-amber-400' : 
                  isComplete ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                )}>
                  {isCurrent && isRejected ? 'Rejected' : step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StatusTimeline;
