export interface ProjectBlueprint {
  id: string;
  name: string;
  appIdea: string;
  targetAudience: string;
  coreFeature: string;
  vibeStyle: 'Modern SaaS' | 'Editorial Calm' | 'Neomorphic Clarity' | 'High-Contrast Studio';
  primaryColor: string;
  secondaryColor: string;
  screenCount: number;
  selectedScreens: string[];
  framework: 'React + Vite + Tailwind' | 'Next.js App Router' | 'Full-Stack Express + React';
  persistenceMode: 'Local Browser Storage' | 'Cloud Database Ready' | 'In-Memory Mock Store';
  repoName: string;
  branchName: string;
  envVariables: { key: string; value: string; description: string; isSecret: boolean }[];
  customDomain: string;
  completedSteps: number[];
  checklistProgress: Record<string, boolean>;
  createdAt: string;
}

export interface StepDefinition {
  stepNumber: number;
  id: 'prompt' | 'design' | 'build' | 'prepare' | 'host';
  shortLabel: string;
  title: string;
  toolName: string;
  toolUrl: string;
  accentColor: string;
  pastelBg: string;
  ringColor: string;
  badgeText: string;
  estimatedMinutes: number;
  subtitle: string;
  outcomeStatement: string;
  underTheHoodTitle: string;
  underTheHoodPoints: { term: string; plainExplanation: string }[];
  checklistItems: { id: string; label: string; detail: string }[];
}

export const WORKFLOW_STEPS: StepDefinition[] = [
  {
    stepNumber: 1,
    id: 'prompt',
    shortLabel: 'Prompt',
    title: 'Shape Your Product Specification',
    toolName: 'Claude',
    toolUrl: 'https://claude.ai',
    accentColor: '#F97316',
    pastelBg: '#FFF7ED',
    ringColor: 'rgba(249, 115, 22, 0.2)',
    badgeText: 'STEP 01 · CLAUDE',
    estimatedMinutes: 5,
    subtitle: 'Turn a rough idea into a structured, unambiguous product blueprint before touching any design or code tools.',
    outcomeStatement: 'Produces a complete Product Requirements Prompt with user flows, screen inventory, and data states.',
    underTheHoodTitle: 'Why start with a conversational spec instead of coding immediately?',
    underTheHoodPoints: [
      {
        term: 'Context Window Grounding',
        plainExplanation: 'Giving an AI builder a structured 4-part specification prevents it from guessing layouts or inventing unwanted features.'
      },
      {
        term: 'State Completeness',
        plainExplanation: 'Defining empty states, loading indicators, and sample records upfront ensures your app feels real on the very first run.'
      },
      {
        term: 'Zero-Jargon Translation',
        plainExplanation: 'Claude translates your domain expertise (like clinic scheduling or inventory logs) into component hierarchy instructions.'
      }
    ],
    checklistItems: [
      {
        id: 'step1-idea',
        label: 'Describe your core application idea in plain language',
        detail: 'Focus on the main problem being solved and who will use it daily.'
      },
      {
        id: 'step1-copy',
        label: 'Copy the synthesized Architect Prompt below into Claude',
        detail: 'Variables highlighted in violet are automatically populated from your inputs.'
      },
      {
        id: 'step1-review',
        label: 'Save Claude’s generated screen breakdown for Step 2',
        detail: 'Make sure it lists 3 to 4 primary screens and clear user actions.'
      }
    ]
  },
  {
    stepNumber: 2,
    id: 'design',
    shortLabel: 'Design',
    title: 'Generate High-Clarity UI Screens',
    toolName: 'Google Stitch',
    toolUrl: 'https://stitch.withgoogle.com',
    accentColor: '#EC4899',
    pastelBg: '#FDF2F8',
    ringColor: 'rgba(236, 72, 153, 0.2)',
    badgeText: 'STEP 02 · GOOGLE STITCH',
    estimatedMinutes: 8,
    subtitle: 'Translate your written specification into visual interface screens, color tokens, and layout references.',
    outcomeStatement: 'Generates exportable HTML/CSS screen mockups and a cohesive design token sheet.',
    underTheHoodTitle: 'How Google Stitch bridges visual taste and working code',
    underTheHoodPoints: [
      {
        term: 'Design System Tokens',
        plainExplanation: 'Colors, typography scales, and border radii are locked in as reusable variables so every screen shares the same visual DNA.'
      },
      {
        term: 'Visual Reference Grounding',
        plainExplanation: 'Exporting Stitch screens gives AI Studio an exact visual target so you never have to describe pixel spacing in words.'
      },
      {
        term: 'Responsive Breakpoints',
        plainExplanation: 'Layouts automatically adapt between desktop sidebars (1024px+) and mobile touch drawers (<768px).'
      }
    ],
    checklistItems: [
      {
        id: 'step2-vibe',
        label: 'Select your visual aesthetic and screen modules',
        detail: 'Choose the surface palette and primary screens that match your audience.'
      },
      {
        id: 'step2-prompt',
        label: 'Paste the Design Generation Prompt into Google Stitch',
        detail: 'Generate the primary workspace view and inspect the visual hierarchy.'
      },
      {
        id: 'step2-export',
        label: 'Export the Stitch design guidelines or reference HTML',
        detail: 'Keep the generated color tokens and layout structure ready for AI Studio.'
      }
    ]
  },
  {
    stepNumber: 3,
    id: 'build',
    shortLabel: 'Build',
    title: 'Assemble the Interactive Application',
    toolName: 'Google AI Studio',
    toolUrl: 'https://aistudio.google.com',
    accentColor: '#3B82F6',
    pastelBg: '#EFF6FF',
    ringColor: 'rgba(59, 130, 246, 0.2)',
    badgeText: 'STEP 03 · AI STUDIO',
    estimatedMinutes: 12,
    subtitle: 'Combine your Claude functional spec and Stitch visual tokens inside Google AI Studio to build a working React application.',
    outcomeStatement: 'Delivers a live, interactive web application with working state, filters, and persistence.',
    underTheHoodTitle: 'What happens inside the AI Studio Build sandbox?',
    underTheHoodPoints: [
      {
        term: 'React + Tailwind Compilation',
        plainExplanation: 'Your prompt and design tokens are compiled into modular TypeScript files that update in real time inside a live preview window.'
      },
      {
        term: 'Client-Side Persistence',
        plainExplanation: 'Using browser LocalStorage lets your users create, edit, and save items immediately without needing a complex database setup.'
      },
      {
        term: 'Iterative Refinement Loop',
        plainExplanation: 'If a button or chart needs adjustment, you can send a 1-sentence follow-up prompt to refine just that specific interaction.'
      }
    ],
    checklistItems: [
      {
        id: 'step3-bundle',
        label: 'Copy the Master Build Prompt with embedded design tokens',
        detail: 'This combines your Step 1 requirements and Step 2 aesthetic rules into one instruction.'
      },
      {
        id: 'step3-verify',
        label: 'Test every button, filter, and form in the live preview',
        detail: 'Ensure there are no dead clicks and that adding a new record updates the view.'
      },
      {
        id: 'step3-polish',
        label: 'Run a follow-up refinement prompt if any edge cases appear',
        detail: 'Use the quick-fix prompt templates below for responsive tweaks or sample data.'
      }
    ]
  },
  {
    stepNumber: 4,
    id: 'prepare',
    shortLabel: 'Prepare',
    title: 'Version Control & Environment Safety',
    toolName: 'GitHub & Copilot',
    toolUrl: 'https://github.com',
    accentColor: '#334155',
    pastelBg: '#F1F5F9',
    ringColor: 'rgba(51, 65, 85, 0.2)',
    badgeText: 'STEP 04 · GITHUB',
    estimatedMinutes: 6,
    subtitle: 'Save your application code into a secure GitHub repository and verify that API keys and configuration files are production-ready.',
    outcomeStatement: 'Establishes a clean Git repository with protected `.env` secrets and verified build scripts.',
    underTheHoodTitle: 'Demystifying Git, Repositories, and Environment Variables',
    underTheHoodPoints: [
      {
        term: 'Git Repository (The Time Machine)',
        plainExplanation: 'Think of GitHub as cloud save-slots for your app. Every "commit" is a restore point you can return to if you ever break something.'
      },
      {
        term: '.env vs .env.example',
        plainExplanation: 'Secret keys stay private on your machine (`.env`), while `.env.example` tells hosting platforms which variable names are required.'
      },
      {
        term: 'Production Build Check (`npm run build`)',
        plainExplanation: 'Verifies that TypeScript types and imports have zero errors before the hosting server tries to publish your site.'
      }
    ],
    checklistItems: [
      {
        id: 'step4-repo',
        label: 'Export or push your project files to a new GitHub repository',
        detail: 'Use the built-in GitHub sync or run the 4-line terminal sequence below.'
      },
      {
        id: 'step4-env',
        label: 'Audit your environment variables in the Secret Inspector',
        detail: 'Confirm no private API keys are hardcoded inside your frontend components.'
      },
      {
        id: 'step4-copilot',
        label: 'Run the Pre-Flight Readiness Prompt with GitHub Copilot',
        detail: 'Automatically check for mobile viewport overflow and missing page metadata.'
      }
    ]
  },
  {
    stepNumber: 5,
    id: 'host',
    shortLabel: 'Host',
    title: 'Launch to a Live Production URL',
    toolName: 'Vercel',
    toolUrl: 'https://vercel.com',
    accentColor: '#10B981',
    pastelBg: '#ECFDF5',
    ringColor: 'rgba(16, 185, 129, 0.2)',
    badgeText: 'STEP 05 · VERCEL',
    estimatedMinutes: 4,
    subtitle: 'Connect your GitHub repository to Vercel for automatic global hosting, SSL security, and instant shareable links.',
    outcomeStatement: 'Publishes your web application to a fast, secure `https://` domain that updates automatically whenever you push changes.',
    underTheHoodTitle: 'How Continuous Deployment works once you are live',
    underTheHoodPoints: [
      {
        term: 'Zero-Config Build Pipeline',
        plainExplanation: 'Vercel detects Vite/React automatically, runs `npm run build` on cloud servers, and distributes your site globally in under 45 seconds.'
      },
      {
        term: 'Automatic HTTPS & Preview URLs',
        plainExplanation: 'Every time you save an update to GitHub, Vercel builds a private preview link so you can test before your main domain updates.'
      },
      {
        term: 'Serverless Environment Injection',
        plainExplanation: 'Paste your environment keys into Vercel’s encrypted dashboard once, and your live app accesses them safely.'
      }
    ],
    checklistItems: [
      {
        id: 'step5-import',
        label: 'Import your GitHub repository inside the Vercel Dashboard',
        detail: 'Keep Framework Preset set to Vite and Output Directory set to `dist`.'
      },
      {
        id: 'step5-env-paste',
        label: 'Copy and paste your formatted Environment Variables block',
        detail: 'Vercel supports pasting multi-line `.env` contents directly into the first row.'
      },
      {
        id: 'step5-deploy',
        label: 'Click Deploy and verify your live production URL',
        detail: 'Test your live link on both desktop and phone browsers to celebrate completion!'
      }
    ]
  }
];

export const PRESET_TEMPLATES: ProjectBlueprint[] = [
  {
    id: 'preset-artisan-crm',
    name: 'Studio Ceramics Order & Kiln Tracker',
    appIdea: 'A calm client order and kiln firing batch tracker for an independent ceramics studio',
    targetAudience: 'Small batch ceramicists and studio managers who hate complex spreadsheets',
    coreFeature: 'Visual firing stage board (Thrown, Bisque, Glazed, Ready for Pickup) with customer SMS copy templates and glaze recipe calculator',
    vibeStyle: 'Modern SaaS',
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    screenCount: 4,
    selectedScreens: ['Batch Overview Board', 'Glaze Recipe Calculator', 'Customer Pickup Queue', 'Kiln Schedule Log'],
    framework: 'React + Vite + Tailwind',
    persistenceMode: 'Local Browser Storage',
    repoName: 'ceramics-kiln-studio',
    branchName: 'main',
    envVariables: [
      { key: 'VITE_STUDIO_NAME', value: 'Kanso Clayworks', description: 'Public studio display title', isSecret: false },
      { key: 'VITE_CURRENCY', value: 'USD', description: 'Default order currency symbol', isSecret: false },
      { key: 'GEMINI_API_KEY', value: 'your_api_key_here', description: 'Server-side key for smart glaze note summaries', isSecret: true }
    ],
    customDomain: 'kiln.kansoclay.studio',
    completedSteps: [1, 2],
    checklistProgress: {
      'step1-idea': true,
      'step1-copy': true,
      'step1-review': true,
      'step2-vibe': true,
      'step2-prompt': true,
      'step2-export': true
    },
    createdAt: '2026-10-08'
  },
  {
    id: 'preset-clinic-intake',
    name: 'Botanical Apothecary Formulation Log',
    appIdea: 'A formulation calculator and batch traceability notebook for an herbal skincare founder',
    targetAudience: 'Boutique skincare formulators tracking ingredient percentages by weight and batch shelf-life',
    coreFeature: 'Auto-balancing 100% weight-by-grams formula table with batch cost breakdown and printable compliance labels',
    vibeStyle: 'Neomorphic Clarity',
    primaryColor: '#3525CD',
    secondaryColor: '#005CC6',
    screenCount: 3,
    selectedScreens: ['Formula Weight Calculator', 'Ingredient Cost Library', 'Batch Compliance Certificates'],
    framework: 'React + Vite + Tailwind',
    persistenceMode: 'Local Browser Storage',
    repoName: 'botanical-formula-lab',
    branchName: 'main',
    envVariables: [
      { key: 'VITE_LAB_UNIT', value: 'grams', description: 'Default measurement precision unit', isSecret: false },
      { key: 'VITE_BATCH_PREFIX', value: 'BOT-2026-', description: 'Automatic lot numbering prefix', isSecret: false }
    ],
    customDomain: 'lab.botanicalatelier.co',
    completedSteps: [1],
    checklistProgress: {
      'step1-idea': true,
      'step1-copy': true,
      'step1-review': true
    },
    createdAt: '2026-10-07'
  },
  {
    id: 'preset-tutor-cohort',
    name: 'Executive Language Cohort Portal',
    appIdea: 'A weekly speaking drill and vocabulary mastery portal for boutique language coaches',
    targetAudience: 'Independent language instructors running 6-week small-group cohorts for professionals',
    coreFeature: 'Interactive flashcard deck builder, weekly session feedback scorecard, and student progress timeline',
    vibeStyle: 'Editorial Calm',
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    screenCount: 4,
    selectedScreens: ['Cohort Progress Matrix', 'Speaking Drill Builder', 'Session Feedback Notes', 'Resource Library'],
    framework: 'React + Vite + Tailwind',
    persistenceMode: 'Local Browser Storage',
    repoName: 'cohort-language-portal',
    branchName: 'main',
    envVariables: [
      { key: 'VITE_COHORT_TERM', value: 'Autumn 2026', description: 'Active cohort session identifier', isSecret: false }
    ],
    customDomain: 'portal.fluentcohort.com',
    completedSteps: [],
    checklistProgress: {},
    createdAt: '2026-10-06'
  }
];
