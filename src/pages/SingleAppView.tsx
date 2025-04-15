import React, { useState, useEffect, useRef } from 'react';
import Terminal from '@/components/Terminal';
import PipelineStage from '@/components/PipelineStage';
import ProgressBar from '@/components/ProgressBar';
import PipelineVisualizer from '@/components/PipelineVisualizer';
import PipelineSelector, { PipelineType } from '@/components/PipelineSelector';
import FinalReport from '@/components/FinalReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  StopCircle,
  FastForward,
} from 'lucide-react';
import { 
  getNextSteps, 
  getStepById, 
  simulateStepOutcome, 
  getRandomInt, 
  generateFailureMessage
} from '@/lib/pipelineSimulator';
import { getPipelineConfig } from '@/lib/pipelineConfigs';
import { type StageStatus } from '@/components/PipelineStage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useSharedBuildState } from '@/hooks/useSharedBuildState';

type BuildStep = {
  name: string;
  status: StageStatus;
};

const SingleAppView: React.FC = () => {
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [fastMode, setFastMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPipelineComplete, setIsPipelineComplete] = useState(false);
  const [buildSuccess, setBuildSuccess] = useState(false);
  const [buildDuration, setBuildDuration] = useState(0);
  const [summaryLogs, setSummaryLogs] = useState<string[]>([]);
  const [stageStatus, setStageStatus] = useState<Record<string, StageStatus>>({});
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineType>('build-initial');
  const [pharmacyId, setPharmacyId] = useState<string>('');
  
  const { isExternalBuildRunning, buildChannelManager } = useSharedBuildState(isRunning, () => {
    toast({
      title: "Build in Progress",
      description: "Another build is currently running in a different tab.",
    });
  });

  const startTimeRef = useRef<number | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  const currentPipeline = getPipelineConfig(selectedPipeline);

  useEffect(() => {
    const initialStageStatus: Record<string, StageStatus> = {};
    currentPipeline.forEach(stage => {
      initialStageStatus[stage.id] = 'pending';
    });
    setStageStatus(initialStageStatus);
    
    if (isRunning) {
      stopPipeline();
    }
    setIsPipelineComplete(false);
    setCompletedSteps({});
    setProgress(0);
    setBuildSteps([]);
    setSummaryLogs([]);
  }, [selectedPipeline]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [buildSteps]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    const totalSteps = currentPipeline.flatMap(stage => stage.steps).length;
    const completedStepCount = Object.keys(completedSteps).length;
    
    setProgress(Math.floor((completedStepCount / totalSteps) * 100));
    
    currentPipeline.forEach(stage => {
      const stageSteps = stage.steps.map(s => s.id);
      const stageCompleted = stageSteps.every(stepId => completedSteps[stepId] === true);
      const stageFailed = stageSteps.some(stepId => completedSteps[stepId] === false);
      const stageRunning = !stageCompleted && !stageFailed && stageSteps.some(stepId => stepId === currentStep);
      
      if (stageFailed) {
        setStageStatus(prev => ({ ...prev, [stage.id]: 'failed' }));
      } else if (stageCompleted) {
        setStageStatus(prev => ({ ...prev, [stage.id]: 'success' }));
      } else if (stageRunning) {
        setStageStatus(prev => ({ ...prev, [stage.id]: 'running' }));
      }
    });
    
    if (isRunning && currentStep) {
      const stepData = getStepById(currentPipeline, currentStep);
      
      if (stepData) {
        const { step, stage } = stepData;
        
        setBuildSteps(prev => [
          ...prev, 
          { name: step.command, status: 'running' }
        ]);
        
        const duration = fastMode 
          ? 500 
          : getRandomInt(step.duration[0], step.duration[1]);
        
        timer = setTimeout(() => {
          const success = simulateStepOutcome(step.successRate);
          
          if (success) {
            setBuildSteps(prev => 
              prev.map(buildStep => 
                buildStep.name === step.command 
                  ? { ...buildStep, status: 'success' } 
                  : buildStep
              )
            );
            
            setSummaryLogs(prev => [
              ...prev,
              `${stage.name}: ${step.command} completed successfully`
            ]);
            
            setCompletedSteps(prev => ({
              ...prev,
              [step.id]: true
            }));
          } else {
            setBuildSteps(prev => 
              prev.map(buildStep => 
                buildStep.name === step.command 
                  ? { ...buildStep, status: 'failed' } 
                  : buildStep
              )
            );
            
            const errorMsg = generateFailureMessage(stage.name, step.id);
            
            setSummaryLogs(prev => [
              ...prev,
              `${stage.name}: ${step.command} failed - ${errorMsg}`
            ]);
            
            setCompletedSteps(prev => ({
              ...prev,
              [step.id]: false
            }));
            
            setIsRunning(false);
            completePipeline(false);
            return;
          }
          
          const nextSteps = getNextSteps(currentPipeline, {
            ...completedSteps,
            [step.id]: success
          });
          
          if (nextSteps.length > 0) {
            setCurrentStep(nextSteps[0]);
          } else {
            const allSteps = currentPipeline.flatMap(s => s.steps.map(step => step.id));
            const allCompleted = allSteps.every(stepId => completedSteps[stepId]);
            
            if (allCompleted) {
              setIsRunning(false);
              completePipeline(true);
            } else {
              setIsRunning(false);
              completePipeline(false);
            }
          }
        }, duration);
      }
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isRunning, currentStep, completedSteps, fastMode, currentPipeline]);

  const saveBuildHistory = async (success: boolean) => {
    if (!pharmacyId.trim()) return;
    
    try {
      const buildData = {
        pipeline_type: selectedPipeline,
        pharmacy_id: pharmacyId,
        success: success,
        duration: buildDuration,
        logs: summaryLogs
      };
      
      const { error } = await supabase
        .from('build_history')
        .insert(buildData);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Build history saved",
        description: "Build information has been stored successfully",
      });
    } catch (error) {
      console.error('Error saving build history:', error);
      toast({
        title: "Failed to save build history",
        description: "There was an error storing the build information",
        variant: "destructive",
      });
    }
  };

  const startPipeline = () => {
    if (isExternalBuildRunning) {
      toast({
        title: "Build in Progress",
        description: "Another build is currently running in a different tab.",
        variant: "destructive",
      });
      return;
    }

    if (!pharmacyId.trim()) {
      setBuildSteps([
        { name: 'Error: Pharmacy ID is required to run the pipeline.', status: 'failed' }
      ]);
      return;
    }

    setBuildSteps([
      { name: `Starting pipeline for Pharmacy ID: ${pharmacyId}...`, status: 'pending' }
    ]);
    setCompletedSteps({});
    setProgress(0);
    setIsPipelineComplete(false);
    setBuildSuccess(false);
    setBuildDuration(0);
    setSummaryLogs([]);
    
    const initialStageStatus: Record<string, StageStatus> = {};
    currentPipeline.forEach(stage => {
      initialStageStatus[stage.id] = 'pending';
    });
    setStageStatus(initialStageStatus);
    
    startTimeRef.current = Date.now();
    
    const nextSteps = getNextSteps(currentPipeline, {});
    if (nextSteps.length > 0) {
      setCurrentStep(nextSteps[0]);
      setIsRunning(true);
    }
  };

  const toggleFastMode = () => {
    setFastMode(prev => !prev);
  };

  const completePipeline = (success: boolean) => {
    if (startTimeRef.current) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setBuildDuration(duration);
    }
    
    setIsPipelineComplete(true);
    setBuildSuccess(success);
    
    setBuildSteps(prev => [
      ...prev, 
      { 
        name: success 
          ? 'Pipeline completed successfully! 🎉' 
          : 'Pipeline failed. See errors above.', 
        status: success ? 'success' : 'failed' 
      }
    ]);
    
    saveBuildHistory(success);
    buildChannelManager.broadcast({ type: 'build-completed' });
  };

  const handleSelectPipeline = (value: PipelineType) => {
    setSelectedPipeline(value);
  };

  const handlePharmacyIdChange = (value: string) => {
    setPharmacyId(value);
  };

  const visualizerStages = currentPipeline.map(stage => ({
    name: stage.name,
    status: stageStatus[stage.id] || 'pending'
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Single App Pipeline</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <PipelineSelector 
                selectedPipeline={selectedPipeline}
                onSelectPipeline={handleSelectPipeline}
                pharmacyId={pharmacyId}
                onPharmacyIdChange={handlePharmacyIdChange}
                labelOverride={null}
              />
              <PipelineVisualizer 
                stages={visualizerStages} 
                pipelineType={selectedPipeline}
              />
            </CardContent>
          </Card>
          
          <div className="mt-4 space-y-2">
            <Button 
              onClick={startPipeline} 
              disabled={isRunning || isPipelineComplete || !pharmacyId.trim() || isExternalBuildRunning}
              className="w-full"
              title={
                isExternalBuildRunning 
                  ? "Another build is currently running" 
                  : !pharmacyId.trim() 
                    ? "Pharmacy ID is required" 
                    : ""
              }
            >
              <Play className="mr-2 h-4 w-4" /> 
              Run Pipeline
            </Button>
            
            {isRunning && (
              <Button 
                onClick={stopPipeline} 
                variant="destructive"
                className="w-full"
              >
                <StopCircle className="mr-2 h-4 w-4" /> 
              Stop
            </Button>
            )}
            
            <Button 
              onClick={toggleFastMode} 
              variant="outline"
              className={`w-full ${fastMode ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
              <FastForward className="mr-2 h-4 w-4" /> 
              {fastMode ? 'Fast Mode: ON' : 'Fast Mode: OFF'}
            </Button>
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Build Progress</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <ProgressBar progress={progress} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          {!isPipelineComplete ? (
            <Card className="h-[70vh] flex flex-col">
              <CardHeader>
                <CardTitle>Build Console</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <Terminal className="h-full p-4">
                  <div className="h-full overflow-auto">
                    {buildSteps.map((step, i) => (
                      <PipelineStage
                        key={i}
                        name={step.name}
                        status={step.status}
                      />
                    ))}
                    {isRunning && (
                      <span className="text-gray-300 blinking-cursor">_</span>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </Terminal>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Build Report</CardTitle>
              </CardHeader>
              <CardContent>
                <FinalReport 
                  success={buildSuccess}
                  duration={buildDuration}
                  logs={summaryLogs}
                  onRestart={startPipeline}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleAppView;
