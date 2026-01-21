
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...props }) => {
  // Check if a background color is provided in className to avoid overriding it with bg-white
  const hasBgColor = className.includes('bg-');
  
  return (
    <div className={`${hasBgColor ? '' : 'bg-white'} rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`} {...props}>
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};
