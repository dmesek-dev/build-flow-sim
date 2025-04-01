
import React from 'react';

type CommandLineProps = {
  command: string;
  prompt?: string;
};

const CommandLine: React.FC<CommandLineProps> = ({ 
  command, 
  prompt = '$ ' 
}) => {
  return (
    <div className="command-line">
      <span className="command-prompt">{prompt}</span>
      <span>{command}</span>
    </div>
  );
};

export default CommandLine;
