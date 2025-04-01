
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type PipelineType = 'build-initial' | 'update-app' | 'update-metadata';

type PipelineSelectorProps = {
  selectedPipeline: PipelineType;
  onSelectPipeline: (value: PipelineType) => void;
};

const PipelineSelector: React.FC<PipelineSelectorProps> = ({ 
  selectedPipeline, 
  onSelectPipeline 
}) => {
  return (
    <div className="w-full mb-4">
      <Select 
        value={selectedPipeline} 
        onValueChange={(value) => onSelectPipeline(value as PipelineType)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select pipeline" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="build-initial">1. Build Initial App</SelectItem>
          <SelectItem value="update-app">2. Update App</SelectItem>
          <SelectItem value="update-metadata">3. Update Metadata</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PipelineSelector;
