
import { useState, useEffect } from 'react';
import { buildChannelManager } from '@/utils/buildChannelManager';

export const useSharedBuildState = (localIsRunning: boolean, onExternalBuildStarted: () => void) => {
  const [isExternalBuildRunning, setIsExternalBuildRunning] = useState(false);

  useEffect(() => {
    // Broadcast when local build starts or stops
    if (localIsRunning) {
      buildChannelManager.broadcast({ type: 'build-started' });
    }

    const unsubscribe = buildChannelManager.subscribe((event) => {
      const { type } = event.data;
      
      if (type === 'build-started') {
        setIsExternalBuildRunning(true);
        if (!localIsRunning) {
          onExternalBuildStarted();
        }
      } else if (type === 'build-completed' || type === 'build-stopped') {
        setIsExternalBuildRunning(false);
      }
    });

    return () => {
      if (localIsRunning) {
        buildChannelManager.broadcast({ type: 'build-stopped' });
      }
      unsubscribe();
    };
  }, [localIsRunning, onExternalBuildStarted]);

  return {
    isExternalBuildRunning,
  };
};
