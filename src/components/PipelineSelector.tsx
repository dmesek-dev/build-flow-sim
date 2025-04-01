
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type PipelineType = 'build-initial' | 'update-app' | 'update-metadata';

type PipelineSelectorProps = {
  selectedPipeline: PipelineType;
  onSelectPipeline: (value: PipelineType) => void;
  pharmacyId: string;
  onPharmacyIdChange: (value: string) => void;
};

const PipelineSelector: React.FC<PipelineSelectorProps> = ({ 
  selectedPipeline, 
  onSelectPipeline,
  pharmacyId,
  onPharmacyIdChange
}) => {
  return (
    <div className="w-full space-y-4">
      <div>
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
      
      <div className="space-y-2">
        <Label htmlFor="pharmacy-id">Pharmacy ID</Label>
        <Input
          id="pharmacy-id"
          type="number"
          placeholder="Enter pharmacy ID"
          value={pharmacyId}
          onChange={(e) => onPharmacyIdChange(e.target.value)}
          min="1"
        />
      </div>
    </div>
  );
};

export default PipelineSelector;
