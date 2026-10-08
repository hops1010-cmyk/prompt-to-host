import React, { useState } from 'react';
import { X, Check, Download, Copy, Sparkles } from 'lucide-react';
import { ProjectBlueprint, WORKFLOW_STEPS } from '../data/workflowData';

interface BlueprintDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectBlueprint;
}

export const BlueprintDrawerModal: React.FC<BlueprintDrawerModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const generateFullMarkdownPacket = () => {
    return `# ${project.name} — Prompt-to-Host Runbook
Generated: ${new Date().toISOString().split('T')[0]}
Target Domain: https://${project.customDomain}

## 1. Product Specification (Claude)
- **App Concept:** ${project.appIdea}
- **Target Audience:** ${project.targetAudience}
- **Core Interactive Feature:** ${project.coreFeature}

## 2. Visual System & Screens (Google Stitch)
- **Aesthetic Preset:** ${project.vibeStyle}
- **Primary Accent:** ${project.primaryColor}
- **Secondary Accent:** ${project.secondaryColor}
- **Target Screens (${project.selectedScreens.length}):**
${project.selectedScreens.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}

## 3. Application Build Stack (Google AI Studio)
- **Framework:** ${project.framework}
- **Persistence Strategy:** ${project.persistenceMode}

## 4. Repository & Environment Keys (GitHub)
- **Repository:** https://github.com/your-username/${project.repoName}
- **Branch:** ${project.branchName}
- **Environment Variables (.env.example):**
\`\`\`env
${project.envVariables.map((e) => `${e.key}="${e.isSecret ? 'YOUR_SECRET_HERE' : e.value}"`).join('\n')}
\`\`\`

## 5. Production Hosting (Vercel)
- **Framework Preset:** Vite
- **Build Command:** \`npm run build\`
- **Output Directory:** \`dist\`
- **Live URL:** https://${project.customDomain}
`;
  };

  const handleCopyPacket = async () => {
    const packet = generateFullMarkdownPacket();
    await navigator.clipboard.writeText(packet);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const packet = generateFullMarkdownPacket();
    const blob = new Blob([packet], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.repoName}-runbook.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-[2px]">
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] w-full max-w-[768px] max-h-[88vh] flex flex-col overflow-hidden shadow-[0px_20px_25px_-5px_rgba(15,23,42,0.08),0px_8px_10px_-6px_rgba(15,23,42,0.04)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4F46E5] block">
                Complete Prompt-to-Host Artifact
              </span>
              <h2 className="text-[18px] font-bold text-[#0F172A]">
                {project.name} — Master Runbook Inspector
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* 5-Stage Status Strip */}
          <div className="grid grid-cols-5 gap-2">
            {WORKFLOW_STEPS.map((st) => {
              const done = project.completedSteps.includes(st.stepNumber);
              return (
                <div
                  key={st.id}
                  className="p-2.5 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.05em]"
                      style={{ color: st.accentColor }}
                    >
                      0{st.stepNumber} · {st.shortLabel}
                    </span>
                    {done && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
                  </div>
                  <div className="text-[12px] font-semibold text-[#0F172A] mt-1 truncate">
                    {st.toolName}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Synthesized Markdown Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#64748B]">
                {project.repoName}-runbook.md
              </span>
              <span className="text-[12px] text-[#64748B]">
                Ready for team handoff or documentation
              </span>
            </div>
            <pre className="p-4 rounded-[8px] bg-[#0F172A] text-[#E2E8F0] font-mono text-[12px] leading-[20px] overflow-x-auto whitespace-pre-wrap">
              {generateFullMarkdownPacket()}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] bg-white border border-[#E2E8F0] text-[13px] font-medium text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            Close Inspector
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyPacket}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white border border-[#E2E8F0] text-[13px] font-medium text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Copied Full Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#64748B]" />
                  <span>Copy Runbook</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-[13px] font-medium text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-[1px] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .md Packet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
