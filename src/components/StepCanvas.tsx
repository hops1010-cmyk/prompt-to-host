import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  ShieldCheck,
  Rocket,
  Sliders,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Globe,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { ProjectBlueprint, StepDefinition } from '../data/workflowData';
import { PromptCopyBlock } from './PromptCopyBlock';

interface StepCanvasProps {
  step: StepDefinition;
  project: ProjectBlueprint;
  onUpdateProject: (updates: Partial<ProjectBlueprint>) => void;
  onToggleChecklist: (itemId: string) => void;
  onCompleteStep: (stepNumber: number) => void;
  onNavigateStep: (stepNumber: number) => void;
}

const AVAILABLE_SCREEN_SUGGESTIONS = [
  'Batch Overview Board',
  'Glaze Recipe Calculator',
  'Customer Pickup Queue',
  'Kiln Schedule Log',
  'Analytics & Revenue Summary',
  'Client Intake Form',
  'Inventory Alert Table',
  'Settings & Export Panel'
];

export const StepCanvas: React.FC<StepCanvasProps> = ({
  step,
  project,
  onUpdateProject,
  onToggleChecklist,
  onCompleteStep,
  onNavigateStep
}) => {
  const [underTheHoodOpen, setUnderTheHoodOpen] = useState(false);
  const [newScreenInput, setNewScreenInput] = useState('');
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvVal, setNewEnvVal] = useState('');
  const [newEnvSecret, setNewEnvSecret] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [deploySimState, setDeploySimState] = useState<'idle' | 'building' | 'live'>('live');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isStepCompleted = project.completedSteps.includes(step.stepNumber);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // Variable dictionary for PromptCopyBlock
  const promptVariables: Record<string, string> = {
    APP_NAME: project.name,
    APP_IDEA: project.appIdea,
    TARGET_AUDIENCE: project.targetAudience,
    CORE_FEATURE: project.coreFeature,
    VIBE_STYLE: project.vibeStyle,
    PRIMARY_COLOR: project.primaryColor,
    SECONDARY_COLOR: project.secondaryColor,
    SCREENS_LIST: project.selectedScreens.join(', '),
    FRAMEWORK: project.framework,
    PERSISTENCE: project.persistenceMode,
    REPO_NAME: project.repoName,
    BRANCH_NAME: project.branchName,
    CUSTOM_DOMAIN: project.customDomain
  };

  const handleAddScreen = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newScreenInput.trim();
    if (!trimmed) return;
    if (!project.selectedScreens.includes(trimmed)) {
      onUpdateProject({
        selectedScreens: [...project.selectedScreens, trimmed],
        screenCount: project.selectedScreens.length + 1
      });
    }
    setNewScreenInput('');
  };

  const handleToggleScreen = (screenName: string) => {
    const exists = project.selectedScreens.includes(screenName);
    const updated = exists
      ? project.selectedScreens.filter((s) => s !== screenName)
      : [...project.selectedScreens, screenName];
    if (updated.length === 0) return; // keep at least 1 screen
    onUpdateProject({
      selectedScreens: updated,
      screenCount: updated.length
    });
  };

  const handleAddEnvVar = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = newEnvKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (!cleanKey) return;
    onUpdateProject({
      envVariables: [
        ...project.envVariables,
        {
          key: cleanKey,
          value: newEnvVal.trim() || 'configured_value',
          description: newEnvSecret ? 'Server-side secret credential' : 'Public runtime configuration',
          isSecret: newEnvSecret
        }
      ]
    });
    setNewEnvKey('');
    setNewEnvVal('');
    setNewEnvSecret(false);
  };

  const handleRemoveEnvVar = (keyToRemove: string) => {
    onUpdateProject({
      envVariables: project.envVariables.filter((item) => item.key !== keyToRemove)
    });
  };

  const runDeploySimulation = () => {
    setDeploySimState('building');
    setTimeout(() => {
      setDeploySimState('live');
      triggerToast(`Production build verified for https://${project.customDomain}`);
    }, 1100);
  };

  return (
    <div className="flex-1 max-w-[800px] space-y-6">
      {/* Floating feedback toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.2)] border border-[#334155] flex items-center gap-2 text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Active Stage Header Card (Level-2 Elevation) */}
      <section className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.06),0px_4px_6px_-4px_rgba(15,23,42,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            {/* Step-specific pill badge */}
            <span
              style={{
                backgroundColor: `${step.accentColor}15`,
                color: step.accentColor
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em]"
            >
              {step.badgeText}
            </span>
            <span className="text-[#CBD5E1]" aria-hidden="true">
              ·
            </span>
            <span className="text-[12px] text-[#64748B] font-mono tabular-nums">
              Est. {step.estimatedMinutes} mins
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={step.toolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors whitespace-nowrap"
            >
              <span>Open {step.toolName}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
            </a>

            <button
              type="button"
              onClick={() => {
                onCompleteStep(step.stepNumber);
                triggerToast(
                  isStepCompleted
                    ? `Step ${step.stepNumber} marked as in-progress`
                    : `Step ${step.stepNumber} (${step.shortLabel}) marked complete!`
                );
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                isStepCompleted
                  ? 'bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30'
                  : 'text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-[1px]'
              }`}
              style={
                !isStepCompleted
                  ? { background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }
                  : undefined
              }
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isStepCompleted ? 'Stage Completed' : 'Mark Stage Complete'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] leading-[36px] tracking-tight text-balance">
          {step.title}
        </h1>
        <p className="mt-2 text-[15px] text-[#475569] leading-[24px]">
          {step.subtitle}
        </p>

        {/* Mechanism-to-Outcome Milestone Strip */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]">
          <div className="flex items-center gap-2 text-[#0F172A] font-medium">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: step.accentColor }}
            />
            <span>Stage Deliverable:</span>
            <span className="text-[#475569] font-normal">{step.outcomeStatement}</span>
          </div>
        </div>
      </section>

      {/* STEP-SPECIFIC INTERACTIVE WORKSPACE */}
      {step.stepNumber === 1 && (
        <section className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#F97316]">
                Interactive Prompt Builder
              </span>
              <h2 className="text-[18px] font-semibold text-[#0F172A] mt-0.5">
                1. Define Your Plain-Language Idea
              </h2>
            </div>
            <span className="text-[12px] text-[#64748B]">
              Updates prompt variables live
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                Application Name
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => onUpdateProject({ name: e.target.value })}
                placeholder="e.g. Studio Ceramics Kiln Tracker"
                className="w-full px-3.5 py-2 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                Who is this built for? (Target Audience)
              </label>
              <input
                type="text"
                value={project.targetAudience}
                onChange={(e) => onUpdateProject({ targetAudience: e.target.value })}
                placeholder="e.g. Independent ceramicists and studio managers"
                className="w-full px-3.5 py-2 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
              What problem does your app solve in one sentence?
            </label>
            <input
              type="text"
              value={project.appIdea}
              onChange={(e) => onUpdateProject({ appIdea: e.target.value })}
              placeholder="Describe your application in everyday language..."
              className="w-full px-3.5 py-2 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
              Core Interactive Feature (What users click, log, or calculate)
            </label>
            <textarea
              rows={2}
              value={project.coreFeature}
              onChange={(e) => onUpdateProject({ coreFeature: e.target.value })}
              placeholder="e.g. Visual firing stage board with glaze recipe calculator..."
              className="w-full px-3.5 py-2 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15 transition-all"
            />
          </div>

          <PromptCopyBlock
            filename="01_claude_product_spec.prompt"
            targetTool="Claude"
            stepAccentColor={step.accentColor}
            variables={promptVariables}
            helperNote="Paste this into Claude.ai to generate a developer-grade specification."
            onCopySuccess={() => {
              if (!project.checklistProgress['step1-copy']) {
                onToggleChecklist('step1-copy');
              }
              triggerToast('Claude Product Specification prompt copied to clipboard');
            }}
            rawText={`You are a Senior Product Architect helping a non-developer domain expert turn an application concept into a clear, build-ready specification.

Project Title: {{APP_NAME}}
Core Concept: {{APP_IDEA}}
Target Audience: {{TARGET_AUDIENCE}}
Signature Interactive Mechanism: {{CORE_FEATURE}}

Please produce a structured, jargon-free Product Blueprint containing:
1. USER JOURNEY FLOW: How a first-time visitor lands, interacts with the primary tool, and sees immediate value in under 60 seconds.
2. SCREEN INVENTORY: Detail the exact layout and components for these primary screens: {{SCREENS_LIST}}.
3. SAMPLE DATA & STATES: Provide 4 realistic domain-authentic sample records so the app never looks empty, plus clear Empty and Filtered states.
4. INTERACTIVE RULES: List every button, filter, and calculation formula so an AI code builder can implement working handlers without dead clicks.`}
          />
        </section>
      )}

      {step.stepNumber === 2 && (
        <section className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#EC4899]">
                Visual Token & Screen Configurator
              </span>
              <h2 className="text-[18px] font-semibold text-[#0F172A] mt-0.5">
                2. Customize Aesthetic Direction & Screens for Google Stitch
              </h2>
            </div>
            <Sliders className="w-4 h-4 text-[#EC4899]" />
          </div>

          {/* Aesthetic Direction Selector */}
          <div>
            <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
              Design Movement Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  {
                    id: 'Modern SaaS',
                    desc: 'Crisp slate borders & indigo focus',
                    primary: '#4F46E5',
                    secondary: '#7C3AED'
                  },
                  {
                    id: 'Neomorphic Clarity',
                    desc: 'Soft elevation & luminous wells',
                    primary: '#3525CD',
                    secondary: '#005CC6'
                  },
                  {
                    id: 'Editorial Calm',
                    desc: 'Airy whitespace & high-contrast ink',
                    primary: '#0F172A',
                    secondary: '#10B981'
                  },
                  {
                    id: 'High-Contrast Studio',
                    desc: 'Precision technical instrumentation',
                    primary: '#2563EB',
                    secondary: '#EC4899'
                  }
                ] as const
              ).map((preset) => {
                const active = project.vibeStyle === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      onUpdateProject({
                        vibeStyle: preset.id,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary
                      })
                    }
                    className={`p-3 rounded-[8px] border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#FDF2F8] border-[#EC4899] ring-2 ring-[#EC4899]/15'
                        : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <div className="text-[13px] font-semibold text-[#0F172A]">
                      {preset.id}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5 leading-4">
                      {preset.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Screen Inventory Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium text-[#0F172A]">
                Target Application Screens ({project.selectedScreens.length} active)
              </label>
              <span className="text-[12px] text-[#64748B]">
                Click to toggle or add custom view
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {AVAILABLE_SCREEN_SUGGESTIONS.map((screen) => {
                const isSelected = project.selectedScreens.includes(screen);
                return (
                  <button
                    key={screen}
                    type="button"
                    onClick={() => handleToggleScreen(screen)}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {screen}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAddScreen} className="flex gap-2">
              <input
                type="text"
                value={newScreenInput}
                onChange={(e) => setNewScreenInput(e.target.value)}
                placeholder="Add a custom screen name (e.g. Supplier Cost Matrix)..."
                className="flex-1 px-3.5 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-[13px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[8px] bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-[12px] font-medium cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Screen</span>
              </button>
            </form>
          </div>

          <PromptCopyBlock
            filename="02_stitch_ui_generation.prompt"
            targetTool="Google Stitch"
            stepAccentColor={step.accentColor}
            variables={promptVariables}
            helperNote="Paste into Google Stitch to generate visual screens and exportable HTML/CSS tokens."
            onCopySuccess={() => {
              if (!project.checklistProgress['step2-prompt']) {
                onToggleChecklist('step2-prompt');
              }
              triggerToast('Google Stitch UI Design prompt copied to clipboard');
            }}
            rawText={`Design a cohesive desktop and mobile web interface for "{{APP_NAME}}" — {{APP_IDEA}}.

Aesthetic Direction: {{VIBE_STYLE}}
Canvas Background: #F8FAFC (Slate 50) with pure #FFFFFF cards and 1px #E2E8F0 borders
Primary Brand Accent: {{PRIMARY_COLOR}} paired with {{SECONDARY_COLOR}}
Typography: Plus Jakarta Sans / Inter for UI hierarchy, JetBrains Mono (tabular-nums) for metrics and IDs.

Generate high-clarity screens covering:
{{SCREENS_LIST}}

Layout Requirements:
- Asymmetric desktop workspace with a 280px left navigation rail and an 800px primary interactive canvas.
- Include realistic domain metrics, a live search/filter bar, and clear primary action buttons for "{{CORE_FEATURE}}".`}
          />
        </section>
      )}

      {step.stepNumber === 3 && (
        <section className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#3B82F6]">
                Full-Stack Synthesis Engine
              </span>
              <h2 className="text-[18px] font-semibold text-[#0F172A] mt-0.5">
                3. Generate Working Code in Google AI Studio
              </h2>
            </div>
            <Layers className="w-4 h-4 text-[#3B82F6]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                Application Architecture
              </label>
              <select
                value={project.framework}
                onChange={(e) =>
                  onUpdateProject({
                    framework: e.target.value as ProjectBlueprint['framework']
                  })
                }
                className="w-full px-3.5 py-2 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              >
                <option value="React + Vite + Tailwind">
                  React + Vite + Tailwind (Recommended SPA)
                </option>
                <option value="Full-Stack Express + React">
                  Full-Stack Express + React (With API Proxy)
                </option>
                <option value="Next.js App Router">
                  Next.js App Router (SSR & SEO Focused)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                Data Persistence Strategy
              </label>
              <select
                value={project.persistenceMode}
                onChange={(e) =>
                  onUpdateProject({
                    persistenceMode: e.target.value as ProjectBlueprint['persistenceMode']
                  })
                }
                className="w-full px-3.5 py-2 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              >
                <option value="Local Browser Storage">
                  Local Browser Storage (Instant Zero-Setup Save)
                </option>
                <option value="Cloud Database Ready">
                  Cloud Database Ready (Structured REST Hooks)
                </option>
                <option value="In-Memory Mock Store">
                  In-Memory Pre-Populated Demo Store
                </option>
              </select>
            </div>
          </div>

          <PromptCopyBlock
            filename="03_aistudio_master_build.prompt"
            targetTool="Google AI Studio"
            stepAccentColor={step.accentColor}
            variables={promptVariables}
            darkMode={true}
            helperNote="Attach your exported Stitch HTML/screenshots in AI Studio and paste this Master Build Prompt."
            onCopySuccess={() => {
              if (!project.checklistProgress['step3-bundle']) {
                onToggleChecklist('step3-bundle');
              }
              triggerToast('AI Studio Master Build Prompt copied to clipboard');
            }}
            rawText={`Build a complete, production-grade web application for "{{APP_NAME}}".

1. PRODUCT OVERVIEW & AUDIENCE
- Concept: {{APP_IDEA}}
- Audience: {{TARGET_AUDIENCE}}
- Core Interactive Mechanism: {{CORE_FEATURE}}

2. ARCHITECTURE & DATA PERSISTENCE
- Stack: {{FRAMEWORK}} with TypeScript and Lucide icons
- Data Storage: {{PERSISTENCE}} with pre-populated realistic sample records and a "Reset Demo Data" button.
- Views to Implement: {{SCREENS_LIST}}

3. DESIGN SYSTEM TOKENS (FROM GOOGLE STITCH)
- Aesthetic Style: {{VIBE_STYLE}}
- Canvas: #F8FAFC | Card Surface: #FFFFFF | Border: 1px solid #E2E8F0 (12px border-radius)
- Primary Accent: {{PRIMARY_COLOR}} | Secondary Accent: {{SECONDARY_COLOR}}
- Every button, filter tab, form modal, and calculation must have a working handler with immediate visual feedback.`}
          />

          {/* Quick Follow-up Iteration Prompts */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#475569] mb-2">
              One-Click Follow-Up Refinement Prompts (If Needed)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  label: 'Add CSV Export & Print View',
                  prompt: `Add a working "Export CSV" button to the primary table in ${project.name} so users can download their current filtered records.`
                },
                {
                  label: 'Fix Mobile Drawer Navigation',
                  prompt: `Ensure the navigation sidebar collapses cleanly into a responsive top milestone bar on screens narrower than 768px.`
                }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(item.prompt);
                    triggerToast(`Copied refinement prompt: "${item.label}"`);
                  }}
                  className="text-left p-2.5 rounded-[8px] bg-white border border-[#E2E8F0] hover:border-[#3B82F6] transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <span className="text-[12px] font-medium text-[#0F172A]">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] text-[#3B82F6] uppercase">
                    Copy
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {step.stepNumber === 4 && (
        <section className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#334155]">
                Repository & Secret Hygiene
              </span>
              <h2 className="text-[18px] font-semibold text-[#0F172A] mt-0.5">
                4. Prepare GitHub Repository & Environment Keys
              </h2>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#334155]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                GitHub Repository Slug
              </label>
              <input
                type="text"
                value={project.repoName}
                onChange={(e) =>
                  onUpdateProject({
                    repoName: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
                  })
                }
                className="w-full px-3.5 py-2 rounded-[8px] bg-white border border-[#E2E8F0] font-mono text-[13px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                Default Production Branch
              </label>
              <input
                type="text"
                value={project.branchName}
                onChange={(e) => onUpdateProject({ branchName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-[8px] bg-white border border-[#E2E8F0] font-mono text-[13px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
          </div>

          {/* Interactive Environment Variable Safety Inspector */}
          <div className="border border-[#E2E8F0] rounded-[8px] p-4 bg-[#F8FAFC] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F172A]">
                  Environment Variable Safety Table (`.env` Inspector)
                </h3>
                <p className="text-[12px] text-[#64748B]">
                  Public browser keys use the <code className="font-mono">VITE_</code> prefix. Private API secrets stay server-side only.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSecrets(!showSecrets)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-white border border-[#E2E8F0] text-[12px] font-medium text-[#475569] hover:text-[#0F172A] cursor-pointer"
              >
                {showSecrets ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Mask Secrets</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Values</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9] text-[11px] font-semibold uppercase tracking-[0.05em] text-[#475569]">
                    <th className="py-2 px-3">Variable Key</th>
                    <th className="py-2 px-3">Value</th>
                    <th className="py-2 px-3">Exposure Scope</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                  {project.envVariables.map((env) => (
                    <tr key={env.key} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-3 font-mono text-[12px] font-medium text-[#0F172A]">
                        {env.key}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[12px] text-[#475569]">
                        {env.isSecret && !showSecrets
                          ? '••••••••••••••••'
                          : env.value}
                      </td>
                      <td className="py-2.5 px-3 text-[12px]">
                        {env.isSecret ? (
                          <span className="inline-flex items-center gap-1 text-[#F59E0B] font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Server Secret (.gitignore)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#10B981] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Client Safe (VITE_)
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveEnvVar(env.key)}
                          className="text-[#64748B] hover:text-[#EF4444] p-1 cursor-pointer"
                          title="Remove variable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form onSubmit={handleAddEnvVar} className="flex flex-wrap sm:flex-nowrap gap-2">
              <input
                type="text"
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                placeholder="KEY_NAME (e.g. VITE_API_URL)"
                className="flex-1 min-w-[160px] px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] font-mono text-[12px]"
              />
              <input
                type="text"
                value={newEnvVal}
                onChange={(e) => setNewEnvVal(e.target.value)}
                placeholder="Value..."
                className="flex-1 min-w-[140px] px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] font-mono text-[12px]"
              />
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] text-[#475569] bg-white border border-[#E2E8F0] rounded-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newEnvSecret}
                  onChange={(e) => setNewEnvSecret(e.target.checked)}
                  className="rounded text-[#4F46E5]"
                />
                <span>Secret</span>
              </label>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-[8px] bg-[#0F172A] text-white text-[12px] font-medium hover:bg-[#1E293B] cursor-pointer whitespace-nowrap"
              >
                + Add Key
              </button>
            </form>
          </div>

          <PromptCopyBlock
            filename="04_github_push_commands.sh"
            targetTool="Git Terminal"
            stepAccentColor={step.accentColor}
            variables={promptVariables}
            darkMode={true}
            helperNote="Run these 5 lines in your project folder terminal if you didn't use one-click GitHub export."
            onCopySuccess={() => {
              if (!project.checklistProgress['step4-repo']) {
                onToggleChecklist('step4-repo');
              }
              triggerToast('Git initialization commands copied');
            }}
            rawText={`# Initialize save history and push to GitHub
git init
git add .
git commit -m "Initial production build of {{APP_NAME}}"
git branch -M {{BRANCH_NAME}}
git remote add origin https://github.com/your-username/{{REPO_NAME}}.git
git push -u origin {{BRANCH_NAME}}`}
          />
        </section>
      )}

      {step.stepNumber === 5 && (
        <section className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#10B981]">
                Production Cloud Launchpad
              </span>
              <h2 className="text-[18px] font-semibold text-[#0F172A] mt-0.5">
                5. Configure Vercel Hosting & Live Domain
              </h2>
            </div>
            <Rocket className="w-4 h-4 text-[#10B981]" />
          </div>

          {/* Custom Domain & Build Settings Simulator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                Target Production Domain
              </label>
              <div className="flex items-center rounded-[8px] bg-white border border-[#E2E8F0] overflow-hidden focus-within:border-[#4F46E5]">
                <span className="px-3 py-2 bg-[#F1F5F9] text-[#64748B] font-mono text-[12px] border-r border-[#E2E8F0]">
                  https://
                </span>
                <input
                  type="text"
                  value={project.customDomain}
                  onChange={(e) => onUpdateProject({ customDomain: e.target.value })}
                  className="w-full px-3 py-2 font-mono text-[13px] text-[#0F172A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                Vercel Build Verification Preview
              </label>
              <button
                type="button"
                onClick={runDeploySimulation}
                className="w-full px-4 py-2 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] text-[13px] font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#10B981] ${
                    deploySimState === 'building' ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {deploySimState === 'building'
                    ? 'Simulating Vite BuildCheck...'
                    : 'Run Dry-Run Deployment Check'}
                </span>
              </button>
            </div>
          </div>

          {/* Exact Vercel Settings Reference Table */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#475569]">
                Vercel Import Settings Card
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#10B981]">
                <Globe className="w-3.5 h-3.5" />
                {deploySimState === 'building'
                  ? 'Building bundle...'
                  : `Ready for https://${project.customDomain}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-3">
                <div className="text-[11px] uppercase tracking-[0.05em] text-[#64748B]">
                  Framework Preset
                </div>
                <div className="font-mono text-[13px] font-semibold text-[#0F172A] mt-1">
                  Vite
                </div>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-3">
                <div className="text-[11px] uppercase tracking-[0.05em] text-[#64748B]">
                  Build Command
                </div>
                <div className="font-mono text-[13px] font-semibold text-[#0F172A] mt-1">
                  npm run build
                </div>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-3">
                <div className="text-[11px] uppercase tracking-[0.05em] text-[#64748B]">
                  Output Directory
                </div>
                <div className="font-mono text-[13px] font-semibold text-[#0F172A] mt-1">
                  dist
                </div>
              </div>
            </div>
          </div>

          <PromptCopyBlock
            filename=".env.production (Vercel Paste Block)"
            targetTool="Vercel Environment Variables"
            stepAccentColor={step.accentColor}
            variables={promptVariables}
            helperNote="Copy and paste directly into the first Environment Variable key box in Vercel."
            onCopySuccess={() => {
              if (!project.checklistProgress['step5-env-paste']) {
                onToggleChecklist('step5-env-paste');
              }
              triggerToast('Vercel Environment Variables block copied');
            }}
            rawText={project.envVariables
              .map((env) => `${env.key}="${env.value}"`)
              .join('\n')}
          />
        </section>
      )}

      {/* Action Checklist Card for Current Stage */}
      <section className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
              Milestone Verification
            </span>
            <h3 className="text-[16px] font-semibold text-[#0F172A] mt-0.5">
              Step {step.stepNumber} Action Items
            </h3>
          </div>
          <span className="font-mono text-[12px] text-[#475569] tabular-nums">
            {
              step.checklistItems.filter((item) => project.checklistProgress[item.id])
                .length
            }{' '}
            of {step.checklistItems.length} Checked
          </span>
        </div>

        <div className="space-y-2.5">
          {step.checklistItems.map((item) => {
            const checked = Boolean(project.checklistProgress[item.id]);
            return (
              <label
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                className={`flex items-start gap-3 p-3.5 rounded-[8px] border transition-all cursor-pointer select-none ${
                  checked
                    ? 'bg-[#F8FAFC] border-[#CBD5E1]'
                    : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  className={`w-5 h-5 rounded-[6px] flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                    checked
                      ? 'bg-[#10B981] text-white border border-[#10B981]'
                      : 'bg-white border border-[#CBD5E1]'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[14px] font-medium ${
                      checked ? 'line-through text-[#64748B]' : 'text-[#0F172A]'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">
                    {item.detail}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Expandable "Under the Hood" Accordion to keep non-technical users calm */}
      <section className="bg-white border border-[#E2E8F0] rounded-[12px] overflow-hidden shadow-[0px_1px_3px_rgba(15,23,42,0.04)]">
        <button
          type="button"
          onClick={() => setUnderTheHoodOpen(!underTheHoodOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-[#4F46E5] shrink-0" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4F46E5] block">
                Under the Hood · Plain-English Primer
              </span>
              <span className="text-[14px] font-semibold text-[#0F172A]">
                {step.underTheHoodTitle}
              </span>
            </div>
          </div>
          {underTheHoodOpen ? (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {underTheHoodOpen && (
          <div className="px-6 pb-5 pt-2 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
            {step.underTheHoodPoints.map((pt) => (
              <div
                key={pt.term}
                className="bg-white border border-[#E2E8F0] rounded-[8px] p-3.5"
              >
                <div className="font-mono text-[12px] font-semibold text-[#0F172A]">
                  {pt.term}
                </div>
                <p className="text-[13px] text-[#475569] mt-1 leading-[20px]">
                  {pt.plainExplanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Stage Progression Footer Controls */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          type="button"
          disabled={step.stepNumber === 1}
          onClick={() => onNavigateStep(Math.max(1, step.stepNumber - 1))}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-[13px] font-medium border transition-colors ${
            step.stepNumber === 1
              ? 'opacity-40 cursor-not-allowed bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8]'
              : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Stage</span>
        </button>

        <div className="flex items-center gap-3">
          {step.stepNumber < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (!isStepCompleted) {
                  onCompleteStep(step.stepNumber);
                }
                onNavigateStep(step.stepNumber + 1);
              }}
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-[13px] font-medium text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-[1px] transition-all cursor-pointer"
            >
              <span>Complete & Continue to Step {step.stepNumber + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isStepCompleted) {
                  onCompleteStep(5);
                }
                triggerToast('Congratulations! All 5 Prompt-to-Host stages completed.');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-[13px] font-medium text-white bg-[#10B981] hover:bg-[#059669] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Finish & Mark Launch Complete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
