
import React from 'react';
import { cn } from '@/lib/utils';

type TerminalProps = {
  children: React.ReactNode;
  className?: string;
};

const Terminal: React.FC<TerminalProps> = ({ children, className }) => {
  return (
    <div className={cn('terminal h-full', className)}>
      {children}
    </div>
  );
};

export default Terminal;
