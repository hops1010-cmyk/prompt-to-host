import React from 'react';
import { Check, Clock } from 'lucide-react';
import { WORKFLOW_STEPS } from '../data/workflowData';

interface StepTrackerProps {
  activeStep: number;
  completedSteps: number[];
  onSelectStep: (stepNumber: number) => void;
  checklistProgress: Record<string, boolean>;
}

export const StepTracker: React.FC<StepTrackerProps> = ({
  activeStep,
  completedSteps,
  onSelectStep,
  checklistProgress
}) => {
  const totalChecklistItems = WORKFLOW_STEPS.reduce(
    (acc, step) => acc + step.checklistItems.length,
    0
  );
  const completedChecklistCount = Object.values(checklistProgress).filter(Boolean).length;
  const overallPercent = Math.round(
    (Math.max(completedChecklistCount, completedSteps.length * 3) / totalChecklistItems) * 100
  );
  const clampedPercent = Math.min(100, overallPercent);

  return (
    <>
      {/* Desktop Sticky Left Rail (1024px+) */}
      <aside className="hidden lg:block w-[280px] shrink-0">
        <div className="sticky top-24 space-y-6">
          {/* Overall Journey Progress Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-4 shadow-[0px_1px_3px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
                Pipeline Progress
              </span>
              <span className="font-mono text-[12px] font-semibold text-[#0F172A] tabular-nums">
                {completedSteps.length}/5 Stages ({clampedPercent}%)
              </span>
            </div>
            {/* 8px Track Rail with Fully Rounded End-Caps */}
            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${Math.max(8, (completedSteps.length / 5) * 100)}%`,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                }}
              />
            </div>
            <p className="mt-2.5 text-[12px] text-[#64748B] leading-4">
              {completedSteps.length === 5
                ? 'All 5 deployment stages complete. Your app is ready for production traffic.'
                : `Currently on Step ${activeStep}: ${
                    WORKFLOW_STEPS[activeStep - 1].toolName
                  }`}
            </p>
          </div>

          {/* 5-Step Vertical Navigation */}
          <nav aria-label="Workflow Steps" className="space-y-2">
            {WORKFLOW_STEPS.map((step) => {
              const isCompleted = completedSteps.includes(step.stepNumber);
              const isActive = activeStep === step.stepNumber;
              const stepTasksCompleted = step.checklistItems.filter(
                (item) => checklistProgress[item.id]
              ).length;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelectStep(step.stepNumber)}
                  style={
                    isActive
                      ? {
                          backgroundColor: step.pastelBg,
                          borderColor: step.accentColor,
                          boxShadow: `0 0 0 3px ${step.ringColor}`
                        }
                      : undefined
                  }
                  className={`w-full text-left p-3.5 rounded-[12px] border transition-all duration-150 cursor-pointer flex items-start gap-3 ${
                    isActive
                      ? 'border'
                      : isCompleted
                      ? 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                      : 'bg-white/70 border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]'
                  }`}
                >
                  {/* Step Status Circle (24px pill circle) */}
                  <div
                    style={
                      isCompleted
                        ? { backgroundColor: '#10B981', color: '#FFFFFF' }
                        : isActive
                        ? {
                            backgroundColor: step.accentColor,
                            color: '#FFFFFF'
                          }
                        : {
                            backgroundColor: '#F1F5F9',
                            color: '#94A3B8'
                          }
                    }
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 mt-0.5 tabular-nums transition-colors"
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      step.stepNumber
                    )}
                  </div>

                  {/* Step Text Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        style={{
                          color: isActive ? step.accentColor : '#64748B'
                        }}
                        className="text-[11px] font-semibold uppercase tracking-[0.05em] truncate"
                      >
                        Step 0{step.stepNumber} · {step.toolName}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[11px] text-[#64748B] font-mono tabular-nums shrink-0">
                        <Clock className="w-3 h-3" />
                        {step.estimatedMinutes}m
                      </span>
                    </div>

                    <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5 truncate">
                      {step.shortLabel}: {step.title.split(' ').slice(0, 3).join(' ')}
                    </div>

                    <div className="flex items-center justify-between mt-1.5 text-[11px] text-[#64748B]">
                      <span>
                        {isCompleted
                          ? 'Milestone complete'
                          : `${stepTasksCompleted}/${step.checklistItems.length} action items`}
                      </span>
                      {isActive && (
                        <span
                          className="font-semibold uppercase tracking-[0.05em]"
                          style={{ color: step.accentColor }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Beginner Reassurance Box */}
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-[12px] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#475569] mb-1">
              Non-Developer Guarantee
            </div>
            <p className="text-[12px] text-[#475569] leading-[18px]">
              Every prompt and terminal snippet on the right automatically adapts to your project details. No manual coding required.
            </p>
          </div>
        </div>
      </aside>

      {/* Tablet & Mobile Horizontal Milestone Bar (<1024px) */}
      <div className="lg:hidden mb-6 bg-white border border-[#E2E8F0] rounded-[12px] p-3 shadow-[0px_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            5-Stage Pipeline ({completedSteps.length}/5 Complete)
          </span>
          <span className="font-mono text-[12px] font-semibold text-[#4F46E5] tabular-nums">
            Step {activeStep} of 5
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {WORKFLOW_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.stepNumber);
            const isActive = activeStep === step.stepNumber;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep(step.stepNumber)}
                style={
                  isActive
                    ? {
                        backgroundColor: step.pastelBg,
                        borderColor: step.accentColor
                      }
                    : undefined
                }
                className={`flex flex-col items-center p-2 rounded-[8px] border text-center transition-all cursor-pointer ${
                  isActive
                    ? 'border'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white'
                }`}
              >
                <div
                  style={
                    isCompleted
                      ? { backgroundColor: '#10B981', color: '#FFFFFF' }
                      : isActive
                      ? { backgroundColor: step.accentColor, color: '#FFFFFF' }
                      : { backgroundColor: '#E2E8F0', color: '#64748B' }
                  }
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold tabular-nums mb-1"
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.stepNumber}
                </div>
                <span className="text-[11px] font-semibold text-[#0F172A] truncate w-full">
                  {step.shortLabel}
                </span>
                <span className="text-[10px] text-[#64748B] truncate w-full hidden sm:block">
                  {step.toolName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
