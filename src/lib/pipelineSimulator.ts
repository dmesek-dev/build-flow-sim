
export type BuildStep = {
  id: string;
  command: string;
  output: string[];
  duration: [number, number]; // min and max duration in ms
  successRate: number; // 0-1 probability of success
  dependsOn?: string[]; // steps that must complete successfully before this one
};

export type BuildStage = {
  id: string;
  name: string;
  steps: BuildStep[];
};

export type BuildResult = {
  success: boolean;
  stage: string;
  step: string;
  message: string;
};

// Predefined pipeline configuration
export const defaultPipeline: BuildStage[] = [
  {
    id: 'build',
    name: 'Build',
    steps: [
      {
        id: 'install-deps',
        command: 'npm install',
        output: [
          'Installing dependencies...',
          'added 1258 packages in 12.5s',
          'Found 0 vulnerabilities'
        ],
        duration: [2000, 4000],
        successRate: 0.95
      },
      {
        id: 'lint',
        command: 'npm run lint',
        output: [
          'Running ESLint...',
          'Checking formatting...',
          'No linting errors found.'
        ],
        duration: [1000, 2000],
        successRate: 0.9,
        dependsOn: ['install-deps']
      },
      {
        id: 'build',
        command: 'npm run build',
        output: [
          'Creating optimized production build...',
          'Compiling...',
          'Build complete.'
        ],
        duration: [3000, 5000],
        successRate: 0.85,
        dependsOn: ['lint']
      }
    ]
  },
  {
    id: 'test',
    name: 'Test',
    steps: [
      {
        id: 'unit-tests',
        command: 'npm run test:unit',
        output: [
          'Running unit tests...',
          'Test suites: 12 passed, 12 total',
          'Tests: 48 passed, 48 total',
          'Time: 3.2s'
        ],
        duration: [2000, 4000],
        successRate: 0.9,
        dependsOn: ['build']
      },
      {
        id: 'integration-tests',
        command: 'npm run test:integration',
        output: [
          'Running integration tests...',
          'Test suites: 5 passed, 5 total',
          'Tests: 15 passed, 15 total',
          'Time: 8.5s'
        ],
        duration: [3000, 6000],
        successRate: 0.8,
        dependsOn: ['unit-tests']
      }
    ]
  },
  {
    id: 'deploy',
    name: 'Deploy',
    steps: [
      {
        id: 'prepare-deployment',
        command: 'npm run predeploy',
        output: [
          'Preparing deployment...',
          'Optimizing assets...',
          'Deployment package ready.'
        ],
        duration: [1000, 2000],
        successRate: 0.95,
        dependsOn: ['integration-tests']
      },
      {
        id: 'deploy-staging',
        command: 'npm run deploy:staging',
        output: [
          'Deploying to staging environment...',
          'Uploading build artifacts...',
          'Configuring environment...',
          'Deployment to staging complete.'
        ],
        duration: [4000, 6000],
        successRate: 0.85,
        dependsOn: ['prepare-deployment']
      },
      {
        id: 'smoke-tests',
        command: 'npm run test:smoke',
        output: [
          'Running smoke tests on staging...',
          'Verifying core functionality...',
          'All smoke tests passed.'
        ],
        duration: [2000, 4000],
        successRate: 0.9,
        dependsOn: ['deploy-staging']
      },
      {
        id: 'deploy-production',
        command: 'npm run deploy:production',
        output: [
          'Deploying to production environment...',
          'Uploading build artifacts...',
          'Configuring environment...',
          'Running database migrations...',
          'Deployment to production complete.'
        ],
        duration: [5000, 8000],
        successRate: 0.8,
        dependsOn: ['smoke-tests']
      }
    ]
  }
];

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const simulateStepOutcome = (successRate: number): boolean => {
  return Math.random() <= successRate;
};

export const generateFailureMessage = (stage: string, step: string): string => {
  const messages = [
    `Error executing ${step} in ${stage} stage.`,
    `${stage}/${step} failed with exit code 1.`,
    `Process ${step} terminated unexpectedly during ${stage}.`,
    `${step} failed: dependency missing or corrupt.`,
    `Failed to complete ${step} due to network error.`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getAllStepIds = (pipeline: BuildStage[]): string[] => {
  return pipeline.flatMap(stage => 
    stage.steps.map(step => step.id)
  );
};

export const getStepById = (pipeline: BuildStage[], stepId: string): { step: BuildStep, stage: BuildStage } | null => {
  for (const stage of pipeline) {
    const step = stage.steps.find(s => s.id === stepId);
    if (step) {
      return { step, stage };
    }
  }
  return null;
};

export const getNextSteps = (pipeline: BuildStage[], completedSteps: Record<string, boolean>): string[] => {
  const allSteps = getAllStepIds(pipeline);
  const nextSteps: string[] = [];
  
  for (const stepId of allSteps) {
    // Skip already completed steps
    if (stepId in completedSteps) continue;
    
    const stepData = getStepById(pipeline, stepId);
    if (!stepData) continue;
    
    const { step } = stepData;
    
    // Check if dependencies are satisfied
    const depsOk = !step.dependsOn || step.dependsOn.every(depId => 
      completedSteps[depId] === true
    );
    
    if (depsOk) {
      nextSteps.push(stepId);
    }
  }
  
  return nextSteps;
};
