import katex from 'katex';
import { useMemo } from 'react';

/** Render a TeX string with KaTeX. Errors render the source instead of crashing the page. */
export function Tex({ tex, block = false, className }: { tex: string; block?: boolean; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { displayMode: block, throwOnError: false, strict: 'ignore' });
    } catch {
      return tex;
    }
  }, [tex, block]);
  const Tag = block ? 'div' : 'span';
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
