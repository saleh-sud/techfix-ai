import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Splitting text into lines and grouping paragraphs or codeblocks safely
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeSnippet = '';
  let codeLang = '';
  let codeBlockIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        const targetCode = codeSnippet.trim();
        const currentIdx = codeBlockIndex++;
        const hasCopied = copiedIndex === currentIdx;

        blocks.push(
          <div key={`code-${i}`} className="my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono tracking-tight text-xs english-ltr relative text-slate-100 shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[10px] text-gray-400">
              <span className="flex items-center gap-1.5 font-bold uppercase">
                <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                {codeLang || 'Code'}
              </span>
              <button 
                onClick={() => handleCopyCode(targetCode, currentIdx)}
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-0.5 px-2 bg-slate-800 rounded border border-slate-700/80 cursor-pointer"
              >
                {hasCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {hasCopied ? 'تم النسخ!' : 'نسخ الكود'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed text-emerald-400/90 selection:bg-slate-800">
              <code>{targetCode}</code>
            </pre>
          </div>
        );

        inCodeBlock = false;
        codeSnippet = '';
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim() || 'javascript';
      }
      continue;
    }

    if (inCodeBlock) {
      codeSnippet += line + '\n';
      continue;
    }

    // Header H3
    if (line.startsWith('### ')) {
      const cleanText = line.replace('### ', '').trim();
      blocks.push(
        <h3 key={i} id={cleanText.replace(/\s+/g, '-')} className="text-base md:text-lg font-black text-slate-800 dark:text-slate-200 mt-6 mb-3 border-r-2 border-brand-cyan pr-2">
          {cleanText}
        </h3>
      );
      continue;
    }

    // Header H2
    if (line.startsWith('## ')) {
      const cleanText = line.replace('## ', '').trim();
      blocks.push(
        <h2 key={i} id={cleanText.replace(/\s+/g, '-')} className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4 border-r-4 border-brand-blue pr-3">
          {cleanText}
        </h2>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const cleanText = line.replace('> ', '').trim();
      // Remove double quotes if present in markdown syntax
      const formatted = cleanText.replace(/^["]|["]$/g, '');
      blocks.push(
        <blockquote key={i} className="my-4 p-4 rounded-xl bg-indigo-50/40 dark:bg-slate-900/40 border-r-4 border-indigo-500 text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed">
          {formatted}
        </blockquote>
      );
      continue;
    }

    // List item
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const cleanText = line.trim().replace(/^[-*]\s+/, '');
      blocks.push(
        <div key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed my-1 pr-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2 shrink-0" />
          <span>{parseInlineStyles(cleanText)}</span>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Standard Paragraph
    blocks.push(
      <p key={i} className="text-xs md:text-sm text-gray-750 dark:text-gray-350 leading-relaxed mb-4 text-justify">
        {parseInlineStyles(line)}
      </p>
    );
  }

  // Inline formatting parser helper for Bold syntax **texts**
  function parseInlineStyles(text: string) {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const codeRegex = /`(.*?)`/g;
    
    let parts: (string | React.ReactNode)[] = [text];

    // Parse bold tags **bold**
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;

      const split = part.split(boldRegex);
      return split.map((str, idx) => {
        if (idx % 2 === 1) {
          return <strong key={`b-${idx}`} className="font-extrabold text-slate-900 dark:text-white">{str}</strong>;
        }
        return str;
      });
    });

    // Parse inline code tags `code`
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;

      const split = part.split(codeRegex);
      return split.map((str, idx) => {
        if (idx % 2 === 1) {
          return (
            <code key={`c-${idx}`} className="mx-1 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 font-mono text-[11px] border border-gray-200 dark:border-slate-700/60 font-bold english-ltr">
              {str}
            </code>
          );
        }
        return str;
      });
    });

    return <>{parts}</>;
  }

  return <div className="space-y-1">{blocks}</div>;
}
