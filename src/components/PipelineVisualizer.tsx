
import React from 'react';
import PipelineStage, { StageStatus } from './PipelineStage';

export type PipelineStageConfig = {
  name: string;
  status: StageStatus;
};

type PipelineVisualizerProps = {
  stages: PipelineStageConfig[];
};

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ stages }) => {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex flex-col space-y-2">
        {stages.map((stage, index) => (
          <PipelineStage
            key={stage.name}
            name={stage.name}
            status={stage.status}
            index={index}
            totalStages={stages.length}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelineVisualizer;
