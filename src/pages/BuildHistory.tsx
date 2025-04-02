
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PipelineType } from '@/components/PipelineSelector';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type BuildRecord = {
  id: string;
  timestamp: Date;
  pipelineType: PipelineType;
  pharmacyId: string;
  success: boolean;
  duration: number; // in seconds
  logs: string[];
};

// Sample data for demonstration
const sampleBuilds: BuildRecord[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    pipelineType: 'build-initial',
    pharmacyId: 'PHARM123',
    success: true,
    duration: 142,
    logs: [
      'Initialization: setup completed successfully',
      'Dependencies: npm packages installed successfully',
      'Build: application built successfully',
      'Test: all tests passed successfully',
      'Deploy: application deployed successfully',
    ],
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    pipelineType: 'update-app',
    pharmacyId: 'PHARM123',
    success: false,
    duration: 89,
    logs: [
      'Initialization: setup completed successfully',
      'Dependencies: npm packages installed successfully',
      'Build: application build failed - Error in component AppHeader.tsx',
      'Test: tests skipped due to build failure',
      'Deploy: deployment skipped due to build failure',
    ],
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 259200000), // 3 days ago
    pipelineType: 'update-metadata',
    pharmacyId: 'PHARM456',
    success: true,
    duration: 65,
    logs: [
      'Initialization: setup completed successfully',
      'Update Metadata: metadata updated successfully',
      'Test: validation tests passed successfully',
      'Publish: metadata published successfully',
    ],
  },
];

const formatDate = (date: Date): string => {
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

const getPipelineName = (pipelineType: PipelineType): string => {
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
  const [builds] = useState<BuildRecord[]>(sampleBuilds);
  const [expandedBuildId, setExpandedBuildId] = useState<string | null>(null);

  const toggleExpand = (buildId: string) => {
    setExpandedBuildId(expandedBuildId === buildId ? null : buildId);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Build History</h1>
          <Button variant="outline" asChild>
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Pipeline
            </Link>
          </Button>
        </div>

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
                      <CardTitle className="text-lg">{getPipelineName(build.pipelineType)}</CardTitle>
                      <span className="text-sm text-gray-500">Pharmacy ID: {build.pharmacyId}</span>
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
                        {build.logs.map((log, index) => (
                          <li key={index} className="mb-1">{log}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildHistory;
