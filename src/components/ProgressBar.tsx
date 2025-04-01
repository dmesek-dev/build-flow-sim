
import React from 'react';

type ProgressBarProps = {
  progress: number; // 0 to 100
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progress-bar mt-2 mb-4">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
