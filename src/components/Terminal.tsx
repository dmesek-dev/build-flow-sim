
import React from 'react';
import { cn } from '@/lib/utils';

type TerminalProps = {
  children: React.ReactNode;
  className?: string;
};

const Terminal: React.FC<TerminalProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'terminal h-full bg-gray-900 text-gray-100 font-mono text-sm rounded-md overflow-hidden border border-gray-800',
      className
    )}>
      {children}
    </div>
  );
};

export default Terminal;
