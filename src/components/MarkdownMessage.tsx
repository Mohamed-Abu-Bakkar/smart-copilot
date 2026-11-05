import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="markdown-message min-w-0 text-sm leading-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mb-3 mt-4 text-lg font-bold tracking-tight first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-bold first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-bold first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => <blockquote className="my-3 border-l-4 border-teal-500/50 pl-3 text-slate-600">{children}</blockquote>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="font-medium text-teal-700 underline underline-offset-2">{children}</a>,
          hr: () => <hr className="my-4 border-slate-200" />,
          table: ({ children }) => <div className="my-3 overflow-x-auto rounded-lg border border-slate-200"><table className="w-full border-collapse text-left text-xs">{children}</table></div>,
          thead: ({ children }) => <thead className="bg-slate-100">{children}</thead>,
          th: ({ children }) => <th className="border-b border-slate-200 px-3 py-2 font-semibold">{children}</th>,
          td: ({ children }) => <td className="border-b border-slate-100 px-3 py-2 align-top">{children}</td>,
          pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-5 text-slate-100">{children}</pre>,
          code: ({ className, children, ...props }) => className
            ? <code className={className} {...props}>{children}</code>
            : <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800">{children}</code>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
