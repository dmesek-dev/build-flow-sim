
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { type StageStatus } from './PipelineStage';
import { getPipelineSummary } from '@/lib/pipelineConfigs';

export type PipelineStageConfig = {
  name: string;
  status: StageStatus;
};

type PipelineVisualizerProps = {
  stages: PipelineStageConfig[];
  pipelineType: string;
};

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ stages, pipelineType }) => {
  const summary = getPipelineSummary(pipelineType);
  
  return (
    <div className="w-full py-4">
      <Card className="mt-4">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold mb-2">Pipeline Summary</h3>
          <p className="text-sm text-gray-500">{summary}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineVisualizer;
