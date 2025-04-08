
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type BuildRecord = {
  id: string;
  timestamp: string;
  pipeline_type: string;
  pharmacy_id: string;
  success: boolean;
  duration: number; // in seconds
  logs: string[] | Record<string, any> | null;
};

// Mock data for build history
const mockBuilds: BuildRecord[] = [
  {
    id: "1",
    timestamp: "2025-04-05T10:30:00Z",
    pipeline_type: "build-initial",
    pharmacy_id: "pharm-123",
    success: true,
    duration: 145,
    logs: [
      "Starting build process...",
      "Initializing environment...",
      "Installing dependencies...",
      "Compiling source code...",
      "Running tests...",
      "Build completed successfully!"
    ]
  },
  {
    id: "2",
    timestamp: "2025-04-04T14:15:00Z",
    pipeline_type: "update-app",
    pharmacy_id: "pharm-456",
    success: false,
    duration: 78,
    logs: [
      "Starting update process...",
      "Pulling latest changes...",
      "Installing dependencies...",
      "Error: Failed to compile bundle",
      "Build failed with exit code 1"
    ]
  },
  {
    id: "3",
    timestamp: "2025-04-03T09:45:00Z",
    pipeline_type: "update-metadata",
    pharmacy_id: "pharm-789",
    success: true,
    duration: 52,
    logs: [
      "Starting metadata update...",
      "Updating app configuration...",
      "Generating new assets...",
      "Update completed successfully!"
    ]
  },
  {
    id: "4",
    timestamp: "2025-04-02T16:20:00Z",
    pipeline_type: "build-initial",
    pharmacy_id: "pharm-123",
    success: true,
    duration: 190,
    logs: [
      "Starting build process...",
      "Setting up environment...",
      "Installing dependencies...",
      "Building application...",
      "Running tests...",
      "Build completed successfully!"
    ]
  }
];

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const getPipelineName = (pipelineType: string): string => {
  switch (pipelineType) {
    case 'build-initial':
      return 'Build Initial App';
    case 'update-app':
      return 'Update App';
    case 'update-metadata':
      return 'Update Metadata';
    default:
      return 'CI/CD';
  }
};

const BuildHistory: React.FC = () => {
  const [builds] = useState<BuildRecord[]>(mockBuilds);
  const [expandedBuildId, setExpandedBuildId] = useState<string | null>(null);
  const [isLoading] = useState<boolean>(false);

  const toggleExpand = (buildId: string) => {
    setExpandedBuildId(expandedBuildId === buildId ? null : buildId);
  };

  // Helper function to render logs properly
  const renderLogs = (logs: string[] | Record<string, any> | null): React.ReactNode => {
    if (Array.isArray(logs)) {
      return logs.map((log, index) => (
        <li key={index} className="mb-1">{String(log)}</li>
      ));
    }
    return <li className="mb-1">No detailed logs available</li>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Build History</h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Loading build history...</p>
        </div>
      ) : builds.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">No build history available yet. Run a pipeline to see records here.</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {builds.map((build) => (
            <Card key={build.id} className="overflow-hidden">
              <Collapsible
                open={expandedBuildId === build.id}
                onOpenChange={() => toggleExpand(build.id)}
              >
                <CardHeader className="pb-2">
                  <CollapsibleTrigger className="w-full text-left flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        build.success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        {build.success ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <CardTitle className="text-lg">{getPipelineName(build.pipeline_type)}</CardTitle>
                      <span className="text-sm text-gray-500">Pharmacy ID: {build.pharmacy_id}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="mr-4">{formatDuration(build.duration)}</span>
                      <span>{formatDate(build.timestamp)}</span>
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Build Logs</h3>
                      <ul className="list-disc pl-5 text-sm">
                        {renderLogs(build.logs)}
                      </ul>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildHistory;
