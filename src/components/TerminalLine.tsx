
import React from 'react';
import { cn } from '@/lib/utils';

type TerminalLineProps = {
  children: React.ReactNode;
  type?: 'info' | 'success' | 'error' | 'warning' | 'default';
  current?: boolean;
  done?: boolean;
  className?: string;
};

const TerminalLine: React.FC<TerminalLineProps> = ({ 
  children, 
  type = 'default', 
  current = false,
  done = false,
  className 
}) => {
  return (
    <div 
      className={cn(
        'terminal-line', 
        type !== 'default' && type,
        current && 'current-step',
        done && 'step-done',
        className
      )}
    >
      {children}
    </div>
  );
};

export default TerminalLine;
