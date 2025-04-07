
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Updated type definition to match the data returned from Supabase
type BuildRecord = {
  id: string;
  timestamp: string;
  pipeline_type: string;
  pharmacy_id: string;
  success: boolean;
  duration: number; // in seconds
  logs: Json; // Using the Json type from Supabase types
};

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
  const [builds, setBuilds] = useState<BuildRecord[]>([]);
  const [expandedBuildId, setExpandedBuildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildHistory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('build_history')
          .select('*')
          .order('timestamp', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setBuilds(data as BuildRecord[] || []);
      } catch (err) {
        console.error('Error fetching build history:', err);
        setError('Failed to load build history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBuildHistory();
  }, []);

  const toggleExpand = (buildId: string) => {
    setExpandedBuildId(expandedBuildId === buildId ? null : buildId);
  };

  // Helper function to render logs properly
  const renderLogs = (logs: Json): React.ReactNode => {
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
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">{error}</div>
          </CardContent>
        </Card>
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
