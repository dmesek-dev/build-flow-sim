
import { BuildStage } from './pipelineSimulator';

// Default pipeline for building the initial app
export const buildInitialPipeline: BuildStage[] = [
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

// Update app pipeline with fewer stages and different steps
export const updateAppPipeline: BuildStage[] = [
  {
    id: 'build',
    name: 'Build',
    steps: [
      {
        id: 'pull-changes',
        command: 'git pull origin main',
        output: [
          'Updating repository...',
          'Fast-forward',
          'Downloaded changes'
        ],
        duration: [1000, 2000],
        successRate: 0.97
      },
      {
        id: 'install-deps',
        command: 'npm install',
        output: [
          'Installing dependencies...',
          'Updated 25 packages in 4.2s',
          'Found 0 vulnerabilities'
        ],
        duration: [1500, 3000],
        successRate: 0.98,
        dependsOn: ['pull-changes']
      },
      {
        id: 'build',
        command: 'npm run build',
        output: [
          'Creating incremental build...',
          'Compiling...',
          'Build complete.'
        ],
        duration: [2000, 3500],
        successRate: 0.9,
        dependsOn: ['install-deps']
      }
    ]
  },
  {
    id: 'test',
    name: 'Test',
    steps: [
      {
        id: 'test-changed-files',
        command: 'npm run test:changed',
        output: [
          'Running tests for changed files...',
          'Test suites: 4 passed, 4 total',
          'Tests: 16 passed, 16 total',
          'Time: 1.8s'
        ],
        duration: [1500, 3000],
        successRate: 0.92,
        dependsOn: ['build']
      }
    ]
  },
  {
    id: 'deploy',
    name: 'Deploy',
    steps: [
      {
        id: 'deploy-staging',
        command: 'npm run deploy:staging',
        output: [
          'Deploying to staging environment...',
          'Uploading build artifacts...',
          'Staging deployment complete.'
        ],
        duration: [2000, 4000],
        successRate: 0.9,
        dependsOn: ['test-changed-files']
      },
      {
        id: 'deploy-production',
        command: 'npm run deploy:production',
        output: [
          'Deploying to production environment...',
          'Uploading build artifacts...',
          'Production deployment complete.'
        ],
        duration: [3000, 5000],
        successRate: 0.85,
        dependsOn: ['deploy-staging']
      }
    ]
  }
];

// Update metadata pipeline - simple and quick process
export const updateMetadataPipeline: BuildStage[] = [
  {
    id: 'validate',
    name: 'Validate',
    steps: [
      {
        id: 'validate-metadata',
        command: 'npm run validate:metadata',
        output: [
          'Validating metadata files...',
          'Checking format...',
          'Validation successful.'
        ],
        duration: [1000, 2000],
        successRate: 0.98
      }
    ]
  },
  {
    id: 'update',
    name: 'Update',
    steps: [
      {
        id: 'update-metadata',
        command: 'npm run update:metadata',
        output: [
          'Updating metadata...',
          'Syncing with CDN...',
          'Metadata updated successfully.'
        ],
        duration: [1500, 2500],
        successRate: 0.95,
        dependsOn: ['validate-metadata']
      }
    ]
  },
  {
    id: 'verify',
    name: 'Verify',
    steps: [
      {
        id: 'verify-metadata',
        command: 'npm run verify:metadata',
        output: [
          'Verifying metadata update...',
          'Checking CDN propagation...',
          'Verification complete.'
        ],
        duration: [1000, 2000],
        successRate: 0.97,
        dependsOn: ['update-metadata']
      }
    ]
  }
];

export const getPipelineConfig = (pipelineType: string) => {
  switch (pipelineType) {
    case 'build-initial':
      return buildInitialPipeline;
    case 'update-app':
      return updateAppPipeline;
    case 'update-metadata':
      return updateMetadataPipeline;
    default:
      return buildInitialPipeline;
  }
};

export const getPipelineSummary = (pipelineType: string): string => {
  switch (pipelineType) {
    case 'build-initial':
      return 'Builds and deploys the initial version of a pharmacy app. Includes installing dependencies, running tests, and deploying to staging and production environments.';
    case 'update-app':
      return 'Updates an existing pharmacy app with new features or bug fixes. Includes getting latest changes, testing only modified components, and deploying to staging and production.';
    case 'update-metadata':
      return 'Updates pharmacy app metadata like store hours, contact info, and services offered without rebuilding the entire app. Validates changes before publishing.';
    default:
      return 'Runs a complete CI/CD pipeline to build, test, and deploy the pharmacy app.';
  }
};
