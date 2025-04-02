
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export type StageStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

type PipelineStageProps = {
  name: string;
  status: StageStatus;
  className?: string;
};

const PipelineStage: React.FC<PipelineStageProps> = ({ 
  name, 
  status,
  className 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return null;
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'skipped':
        return null;
    }
  };

  return (
    <div className={cn('flex items-center justify-between py-2 border-b border-gray-200 last:border-0', className)}>
      <div className="text-sm font-mono">{name}</div>
      <div className="flex items-center">
        {getStatusIcon()}
      </div>
    </div>
  );
};

export default PipelineStage;
