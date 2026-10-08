import React, { useState } from 'react';
import { Check, Clipboard, Terminal, Sparkles } from 'lucide-react';

interface PromptCopyBlockProps {
  filename: string;
  targetTool: string;
  stepAccentColor: string;
  rawText: string;
  variables?: Record<string, string>;
  darkMode?: boolean;
  helperNote?: string;
  onCopySuccess?: () => void;
}

export const PromptCopyBlock: React.FC<PromptCopyBlockProps> = ({
  filename,
  targetTool,
  stepAccentColor,
  rawText,
  variables = {},
  darkMode = false,
  helperNote,
  onCopySuccess
}) => {
  const [copied, setCopied] = useState(false);

  // Replace {{VAR}} with actual value for clipboard copy
  const getInterpolatedText = () => {
    let output = rawText;
    Object.entries(variables).forEach(([key, val]) => {
      const token = `{{${key}}}`;
      output = output.split(token).join(val || `[${key}]`);
    });
    return output;
  };

  const handleCopy = async () => {
    const textToCopy = getInterpolatedText();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Render text with violet pill highlights for {{VARIABLE}} tokens
  const renderHighlightedContent = () => {
    const parts = rawText.split(/(\{\{[A-Z0-9_]+\}\})/g);
    return parts.map((part, idx) => {
      const match = part.match(/^\{\{([A-Z0-9_]+)\}\}$/);
      if (match) {
        const varKey = match[1];
        const resolvedValue = variables[varKey];
        return (
          <span
            key={idx}
            title={`Variable: {{${varKey}}}`}
            className={
              darkMode
                ? 'inline-flex items-center gap-1 rounded-full bg-[#7C3AED]/25 border border-[#8A4CFC]/50 px-2 py-0.5 text-[12px] font-medium text-[#EADDFF] mx-0.5'
                : 'inline-flex items-center gap-1 rounded-full bg-[#EADDFF] border border-[#7C3AED]/25 px-2 py-0.5 text-[12px] font-medium text-[#5A00C6] mx-0.5'
            }
          >
            <span className="opacity-65 text-[10px]">var</span>
            <span>{resolvedValue || `{{${varKey}}}`}</span>
          </span>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="rounded-[8px] border border-[#E2E8F0] overflow-hidden bg-white">
      {/* Top Bar */}
      <div
        className={`flex items-center justify-between px-3.5 py-2 border-b ${
          darkMode
            ? 'bg-[#0F172A] border-[#1E293B] text-[#E2E8F0]'
            : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#0F172A]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Terminal
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: stepAccentColor }}
          />
          <span className="font-mono text-[11px] font-semibold tracking-[0.05em] uppercase truncate">
            {filename}
          </span>
          <span className="text-[#94A3B8]" aria-hidden="true">
            ·
          </span>
          <span
            className="inline-flex items-center gap-1 font-mono text-[11px] font-medium tracking-[0.05em] uppercase shrink-0"
            style={{ color: darkMode ? '#CBD5E1' : '#475569' }}
          >
            <Sparkles className="w-3 h-3" style={{ color: stepAccentColor }} />
            Target: {targetTool}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[12px] font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
            copied
              ? 'bg-[#10B981] text-white border border-[#10B981]'
              : darkMode
              ? 'bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] border border-[#334155]'
              : 'bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#CBD5E1]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied Prompt</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Copy for {targetTool}</span>
            </>
          )}
        </button>
      </div>

      {/* Body Area */}
      <div
        className={`p-4 font-mono text-[13px] leading-[22px] whitespace-pre-wrap break-words ${
          darkMode
            ? 'bg-[#0F172A] text-[#E2E8F0]'
            : 'bg-[#F8FAFC] text-[#0F172A]'
        }`}
      >
        {renderHighlightedContent()}
      </div>

      {/* Optional Footer Helper */}
      {helperNote && (
        <div
          className={`px-4 py-2 text-[12px] border-t flex items-center justify-between ${
            darkMode
              ? 'bg-[#0F172A]/95 border-[#1E293B] text-[#94A3B8]'
              : 'bg-white border-[#E2E8F0] text-[#64748B]'
          }`}
        >
          <span>{helperNote}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#4F46E5]">
            Variables Injected Live
          </span>
        </div>
      )}
    </div>
  );
};
