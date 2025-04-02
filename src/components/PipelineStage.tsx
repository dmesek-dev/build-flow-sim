
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, CircleAlert, Circle, Loader2 } from 'lucide-react';

export type StageStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

type PipelineStageProps = {
  name: string;
  status: StageStatus;
  index: number;
  totalStages: number;
  className?: string;
};

const PipelineStage: React.FC<PipelineStageProps> = ({ 
  name, 
  status, 
  index, 
  totalStages,
  className 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Circle className="h-5 w-5" />;
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'skipped':
        return <CircleAlert className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'pending':
        return 'text-gray-400 border-gray-400';
      case 'running':
        return 'text-blue-400 border-blue-400';
      case 'success':
        return 'text-green-400 border-green-400';
      case 'failed':
        return 'text-red-400 border-red-400';
      case 'skipped':
        return 'text-yellow-400 border-yellow-400';
    }
  };

  return (
    <div className={cn('flex items-center relative', className)}>
      <div className={cn(
        'flex items-center justify-center w-10 h-10 rounded-full border-2 z-10',
        getStatusClass()
      )}>
        {getStatusIcon()}
      </div>
      <div className="text-sm ml-3">{name}</div>
      
      {index < totalStages - 1 && (
        <div className={cn(
          'absolute top-10 left-5 w-0.5 h-full -ml-px z-0',
          status === 'pending' ? 'bg-gray-400' : 
          status === 'running' ? 'bg-blue-400' : 
          status === 'success' ? 'bg-green-400' : 
          status === 'failed' ? 'bg-red-400' : 
          'bg-yellow-400'
        )} />
      )}
    </div>
  );
};

export default PipelineStage;
