
import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type FinalReportProps = {
  success: boolean;
  duration: number; // in seconds
  logs: string[];
  onRestart: () => void;
};

const FinalReport: React.FC<FinalReportProps> = ({ 
  success, 
  duration, 
  logs,
  onRestart 
}) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className={cn(
        "flex items-center justify-center w-16 h-16 rounded-full mb-4",
        success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      )}>
        {success ? (
          <CheckCircle className="w-10 h-10" />
        ) : (
          <XCircle className="w-10 h-10" />
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-2">
        {success ? "Pipeline Succeeded" : "Pipeline Failed"}
      </h2>
      
      <div className="flex items-center text-gray-500 mb-4">
        <Clock className="w-4 h-4 mr-1" />
        <span>Duration: {formatDuration(duration)}</span>
      </div>
      
      <div className="w-full max-w-xl bg-gray-100 p-4 rounded-md mb-6 max-h-40 overflow-auto">
        <h3 className="font-semibold mb-2">Build Summary</h3>
        <ul className="list-disc pl-5 text-sm">
          {logs.map((log, index) => (
            <li key={index} className="mb-1">{log}</li>
          ))}
        </ul>
      </div>
      
      <Button onClick={onRestart}>
        Run Again
      </Button>
    </div>
  );
};

export default FinalReport;
