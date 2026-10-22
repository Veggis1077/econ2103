import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Tex } from './Tex';

/**
 * Inline rich-text renderer for content strings:
 * $tex$, **bold**, *italic*, `code`, [label](#/route or https://…).
 */
export function Rich({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{renderInline(text)}</span>;
}

/** Paragraph-level: splits on blank lines and supports $$display$$ math. */
export function RichBlock({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\n\s*\n/);
  return (
    <div className={className}>
      {parts.map((p, i) => {
        const m = p.trim().match(/^\$\$([\s\S]+)\$\$$/);
        if (m) return <Tex key={i} tex={m[1]} block />;
        return <p key={i}>{renderInline(p)}</p>;
      })}
    </div>
  );
}

// Inline math must start with a non-digit, non-space character so currency like "$4 and $1" stays text.
const TOKEN = /(\$\$[^$]+\$\$|\$[^\s\d$](?:[^$]*[^\s$])?\$|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(TOKEN)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(<Fragment key={k++}>{text.slice(last, idx)}</Fragment>);
    const t = m[0];
    if (t.startsWith('$$')) out.push(<Tex key={k++} tex={t.slice(2, -2)} block />);
    else if (t.startsWith('$')) out.push(<Tex key={k++} tex={t.slice(1, -1)} />);
    else if (t.startsWith('**')) out.push(<strong key={k++} className="font-semibold text-ink-900 dark:text-white">{renderInline(t.slice(2, -2))}</strong>);
    else if (t.startsWith('`')) out.push(<code key={k++} className="rounded bg-ink-100 px-1 py-0.5 font-mono text-[0.85em] dark:bg-ink-800">{t.slice(1, -1)}</code>);
    else if (t.startsWith('[')) {
      const lm = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      const href = lm[2];
      out.push(
        href.startsWith('#/') ? (
          <Link key={k++} to={href.slice(1)} className="link">{lm[1]}</Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noreferrer" className="link">{lm[1]}</a>
        ),
      );
    } else out.push(<em key={k++}>{renderInline(t.slice(1, -1))}</em>);
    last = idx + t.length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return out;
}

/** Strip markup for search indexing and plain-text contexts. */
export const plain = (s: string) => s.replace(/\$\$([^$]+)\$\$/g, '$1').replace(/\$([^\s\d$](?:[^$]*[^\s$])?)\$/g, '$1').replace(/\*\*?|`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
