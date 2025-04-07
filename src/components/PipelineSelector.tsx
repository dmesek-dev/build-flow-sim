
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export type PipelineType = 'build-initial' | 'update-app' | 'update-metadata';

interface PipelineSelectorProps {
  selectedPipeline: PipelineType;
  onSelectPipeline: (value: PipelineType) => void;
  pharmacyId: string;
  onPharmacyIdChange: (value: string) => void;
  labelOverride?: string | null;
  placeholder?: string;
}

const PipelineSelector: React.FC<PipelineSelectorProps> = ({ 
  selectedPipeline, 
  onSelectPipeline,
  pharmacyId,
  onPharmacyIdChange,
  labelOverride = null,
  placeholder = "Enter pharmacy ID"
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pipeline-type">Pipeline Type</Label>
        <Select 
          value={selectedPipeline}
          onValueChange={(value) => onSelectPipeline(value as PipelineType)}
        >
          <SelectTrigger id="pipeline-type">
            <SelectValue placeholder="Select pipeline type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="build-initial">Build Initial App</SelectItem>
            <SelectItem value="update-app">Update App</SelectItem>
            <SelectItem value="update-metadata">Update Metadata</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pharmacy-id">{labelOverride || 'Pharmacy ID'}</Label>
        <Input 
          id="pharmacy-id"
          value={pharmacyId}
          onChange={(e) => onPharmacyIdChange(e.target.value)}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
};

export default PipelineSelector;
