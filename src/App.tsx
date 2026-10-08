/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  FolderKanban,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Compass,
  BookOpen
} from 'lucide-react';
import {
  PRESET_TEMPLATES,
  ProjectBlueprint,
  WORKFLOW_STEPS
} from './data/workflowData';
import { StepTracker } from './components/StepTracker';
import { StepCanvas } from './components/StepCanvas';
import { BlueprintDrawerModal } from './components/BlueprintDrawerModal';

const STORAGE_KEY = 'prompt_to_host_active_blueprint_v1';

export default function App() {
  const [project, setProject] = useState<ProjectBlueprint>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    return PRESET_TEMPLATES[0];
  });

  const [activeStepNumber, setActiveStepNumber] = useState<number>(1);
  const [activeView, setActiveView] = useState<'workflow' | 'templates' | 'glossary'>('workflow');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      // ignore storage errors
    }
  }, [project]);

  const handleUpdateProject = (updates: Partial<ProjectBlueprint>) => {
    setProject((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const handleToggleChecklist = (itemId: string) => {
    setProject((prev) => {
      const nextChecked = !prev.checklistProgress[itemId];
      const updatedChecklist = {
        ...prev.checklistProgress,
        [itemId]: nextChecked
      };

      // Check if all items in the active step are now completed
      const currentStepDef = WORKFLOW_STEPS[activeStepNumber - 1];
      const allStepItemsChecked = currentStepDef.checklistItems.every(
        (item) => updatedChecklist[item.id]
      );

      let updatedCompletedSteps = [...prev.completedSteps];
      if (allStepItemsChecked && !updatedCompletedSteps.includes(activeStepNumber)) {
        updatedCompletedSteps.push(activeStepNumber);
      }

      return {
        ...prev,
        checklistProgress: updatedChecklist,
        completedSteps: updatedCompletedSteps
      };
    });
  };

  const handleCompleteStep = (stepNumber: number) => {
    setProject((prev) => {
      const exists = prev.completedSteps.includes(stepNumber);
      const nextCompleted = exists
        ? prev.completedSteps.filter((s) => s !== stepNumber)
        : [...prev.completedSteps, stepNumber].sort((a, b) => a - b);

      // Also mark checklist items for this step if completing
      const stepDef = WORKFLOW_STEPS[stepNumber - 1];
      const nextChecklist = { ...prev.checklistProgress };
      if (!exists && stepDef) {
        stepDef.checklistItems.forEach((item) => {
          nextChecklist[item.id] = true;
        });
      }

      return {
        ...prev,
        completedSteps: nextCompleted,
        checklistProgress: nextChecklist
      };
    });
  };

  const handleSelectPreset = (preset: ProjectBlueprint) => {
    setProject({
      ...preset,
      id: `${preset.id}-${Date.now()}`
    });
    setActiveStepNumber(1);
    setActiveView('workflow');
  };

  const handleResetProgress = () => {
    setProject((prev) => ({
      ...prev,
      completedSteps: [],
      checklistProgress: {}
    }));
    setActiveStepNumber(1);
  };

  const currentStep = WORKFLOW_STEPS[activeStepNumber - 1] || WORKFLOW_STEPS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#workflow"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('workflow');
            }}
            className="text-[18px] font-bold tracking-tight text-[#0F172A] whitespace-nowrap"
          >
            Prompt to Host
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[#475569]">
            <button
              type="button"
              onClick={() => setActiveView('workflow')}
              className={`hover:text-[#0F172A] transition-colors py-1 cursor-pointer whitespace-nowrap ${
                activeView === 'workflow'
                  ? 'text-[#0F172A] border-b-2 border-[#4F46E5]'
                  : ''
              }`}
            >
              5-Step Pipeline
            </button>
            <button
              type="button"
              onClick={() => setActiveView('templates')}
              className={`hover:text-[#0F172A] transition-colors py-1 cursor-pointer whitespace-nowrap ${
                activeView === 'templates'
                  ? 'text-[#0F172A] border-b-2 border-[#4F46E5]'
                  : ''
              }`}
            >
              Starter Blueprints
            </button>
            <button
              type="button"
              onClick={() => setActiveView('glossary')}
              className={`hover:text-[#0F172A] transition-colors py-1 cursor-pointer whitespace-nowrap ${
                activeView === 'glossary'
                  ? 'text-[#0F172A] border-b-2 border-[#4F46E5]'
                  : ''
              }`}
            >
              Tool Demystifier
            </button>
            <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              className="hover:text-[#0F172A] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Runbook Export
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetProgress}
              title="Reset stage checkmarks"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[12px] font-medium bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>

            <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-[12px] font-medium text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-[1px] transition-all cursor-pointer whitespace-nowrap"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Inspect Master Runbook</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header Project Context Bar */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-[#475569] min-w-0">
            <span className="font-semibold text-[#0F172A] truncate">
              Active Blueprint: {project.name}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[12px] text-[#64748B] truncate hidden sm:inline">
              https://{project.customDomain}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span className="text-[12px] text-[#4F46E5] font-medium whitespace-nowrap">
              {project.vibeStyle}
            </span>
          </div>

          {/* Quick Preset Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
              Load Example:
            </span>
            <div className="flex items-center gap-1">
              {PRESET_TEMPLATES.map((preset) => {
                const isCurrent = project.name === preset.name;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]/30'
                        : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {preset.name.split(' ').slice(0, 2).join(' ')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container (1120px max-width) */}
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-8">
        {activeView === 'workflow' && (
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left 280px Step Tracker Rail */}
            <StepTracker
              activeStep={activeStepNumber}
              completedSteps={project.completedSteps}
              onSelectStep={(num) => setActiveStepNumber(num)}
              checklistProgress={project.checklistProgress}
            />

            {/* Right 800px Active Step Canvas */}
            <StepCanvas
              step={currentStep}
              project={project}
              onUpdateProject={handleUpdateProject}
              onToggleChecklist={handleToggleChecklist}
              onCompleteStep={handleCompleteStep}
              onNavigateStep={(num) => {
                setActiveStepNumber(num);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeView === 'templates' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2 text-[#4F46E5] text-[11px] font-semibold uppercase tracking-[0.05em] mb-1">
                <FolderKanban className="w-4 h-4" />
                <span>Curated Domain-Expert Blueprints</span>
              </div>
              <h1 className="text-[28px] font-bold text-[#0F172A]">
                Start from a Real-World Application Template
              </h1>
              <p className="text-[15px] text-[#475569] mt-1 max-w-2xl">
                Select any starter blueprint below to pre-populate all 5 stages—including Claude product specifications, Google Stitch design tokens, AI Studio build prompts, and Vercel environment variables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRESET_TEMPLATES.map((tpl) => {
                const isSelected = project.name === tpl.name;
                return (
                  <div
                    key={tpl.id}
                    className={`bg-white rounded-[12px] border p-6 flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-[#4F46E5] shadow-[0_0_0_3px_rgba(79,70,229,0.15)]'
                        : 'border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.04)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[12px] text-[#64748B] mb-3">
                        <span>{tpl.vibeStyle}</span>
                        <span>·</span>
                        <span className="font-mono">{tpl.selectedScreens.length} screens</span>
                      </div>

                      <h2 className="text-[18px] font-bold text-[#0F172A]">
                        {tpl.name}
                      </h2>
                      <p className="text-[14px] text-[#475569] mt-2 leading-[21px]">
                        {tpl.appIdea}
                      </p>

                      <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-2 text-[12px] text-[#475569]">
                        <div>
                          <span className="font-semibold text-[#0F172A]">Audience: </span>
                          {tpl.targetAudience}
                        </div>
                        <div>
                          <span className="font-semibold text-[#0F172A]">Signature Tool: </span>
                          {tpl.coreFeature}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPreset(tpl)}
                      className="mt-6 w-full py-2.5 px-4 rounded-[8px] text-[13px] font-medium bg-[#0F172A] text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
                    >
                      {isSelected ? 'Currently Active Blueprint' : 'Load Blueprint Into Pipeline'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'glossary' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2 text-[#4F46E5] text-[11px] font-semibold uppercase tracking-[0.05em] mb-1">
                <Compass className="w-4 h-4" />
                <span>Radical Demystification Guide</span>
              </div>
              <h1 className="text-[28px] font-bold text-[#0F172A]">
                How the 5 Generative Engineering Tools Fit Together
              </h1>
              <p className="text-[15px] text-[#475569] mt-1 max-w-2xl">
                You do not need to memorize terminal flags or software architecture. Each tool in this workflow handles one clear responsibility and hands a clean artifact to the next stage.
              </p>
            </div>

            <div className="space-y-4">
              {WORKFLOW_STEPS.map((st) => (
                <div
                  key={st.id}
                  className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{
                          backgroundColor: `${st.accentColor}15`,
                          color: st.accentColor
                        }}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em]"
                      >
                        {st.badgeText}
                      </span>
                      <h2 className="text-[18px] font-bold text-[#0F172A]">
                        {st.shortLabel} — {st.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveStepNumber(st.stepNumber);
                        setActiveView('workflow');
                      }}
                      className="text-[13px] font-medium text-[#4F46E5] hover:underline cursor-pointer"
                    >
                      Jump to Step {st.stepNumber} →
                    </button>
                  </div>

                  <p className="text-[14px] text-[#475569] mb-4">{st.subtitle}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {st.underTheHoodPoints.map((pt) => (
                      <div
                        key={pt.term}
                        className="p-3.5 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0]"
                      >
                        <div className="font-mono text-[12px] font-semibold text-[#0F172A]">
                          {pt.term}
                        </div>
                        <p className="text-[12px] text-[#475569] mt-1 leading-[18px]">
                          {pt.plainExplanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-5 mt-12">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#64748B]">
          <div>
            Prompt to Host Workflow · Designed for non-developers stepping into generative engineering
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveView('workflow')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Pipeline Canvas
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveView('templates')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Starter Blueprints
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Export Runbook (.md)
            </button>
          </div>
        </div>
      </footer>

      {/* Master Runbook Modal */}
      <BlueprintDrawerModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        project={project}
      />
    </div>
  );
}
