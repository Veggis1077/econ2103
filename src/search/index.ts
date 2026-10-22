import { LECTURES, shortLectureLabel } from '../content/lectures';
import { CONCEPTS, FORMULAS } from '../content/library';
import { QUESTIONS } from '../content/questionBank';
import { PROBLEM_SETS } from '../content/problems';
import { LAB_MODELS } from '../lab/registry';
import { plain } from '../components/ui/Rich';

export type SearchKind = 'Lecture' | 'Section' | 'Concept' | 'Formula' | 'Model' | 'Question' | 'Problem';

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  subtitle: string;
  path: string;
  text: string;
}

let cache: SearchEntry[] | null = null;

export function searchIndex(): SearchEntry[] {
  if (cache) return cache;
  const out: SearchEntry[] = [];
  for (const l of LECTURES) {
    out.push({ kind: 'Lecture', title: `Ch. ${l.number} · ${l.title}`, subtitle: l.subtitle, path: `/learn/${l.id}`, text: [l.title, l.subtitle, ...l.keywords, ...l.objectives].join(' ') });
    for (const s of l.sections) {
      const body = s.blocks.map((b) => ('text' in b && typeof b.text === 'string' ? b.text : 'term' in b ? `${b.term} ${b.text}` : 'title' in b && typeof b.title === 'string' ? b.title : '')).join(' ');
      out.push({ kind: 'Section', title: s.title, subtitle: `Ch. ${l.number} · ${l.title}`, path: `/learn/${l.id}#${s.id}`, text: plain(`${s.title} ${body}`) });
    }
  }
  for (const c of CONCEPTS) out.push({ kind: 'Concept', title: c.term, subtitle: `${shortLectureLabel(c.lecture)} · ${plain(c.definition).slice(0, 90)}`, path: `/library?concept=${c.id}`, text: plain(`${c.term} ${c.definition} ${c.note ?? ''}`) });
  for (const f of FORMULAS) out.push({ kind: 'Formula', title: f.name, subtitle: `${shortLectureLabel(f.lecture)} · ${plain(f.explanation).slice(0, 90)}`, path: `/library?formula=${f.id}`, text: plain(`${f.name} ${f.explanation}`) });
  for (const m of LAB_MODELS) out.push({ kind: 'Model', title: m.title, subtitle: m.summary, path: `/lab/${m.id}`, text: `${m.title} ${m.summary} ${m.tags.join(' ')}` });
  for (const q of QUESTIONS) {
    const t = plain(`${q.stem} ${q.question ?? ''}`).trim() || q.source;
    out.push({ kind: 'Question', title: t.length > 90 ? `${t.slice(0, 90)}…` : t, subtitle: q.source, path: `/practice/q/${q.id}`, text: plain(`${q.stem} ${q.question ?? ''} ${(q.options ?? []).join(' ')} ${q.topics.join(' ')}`) });
  }
  for (const ps of PROBLEM_SETS) for (const p of ps.problems) out.push({ kind: 'Problem', title: p.title, subtitle: p.source, path: `/practice/problems/${ps.id}#${p.id}`, text: plain(`${p.title} ${p.intro} ${p.parts.map((x) => x.prompt).join(' ')}`) });
  cache = out;
  return out;
}

/** Simple ranked search: every query token must appear; title hits rank higher. */
export function search(query: string, limit = 40): SearchEntry[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const kindBoost: Record<SearchKind, number> = { Lecture: 6, Model: 5, Concept: 5, Formula: 4, Section: 3, Problem: 2, Question: 1 };
  const scored: { e: SearchEntry; s: number }[] = [];
  for (const e of searchIndex()) {
    const title = e.title.toLowerCase();
    const hay = `${title} ${e.text.toLowerCase()}`;
    if (!tokens.every((t) => hay.includes(t))) continue;
    let s = kindBoost[e.kind];
    for (const t of tokens) {
      if (title.startsWith(t)) s += 8;
      else if (title.includes(t)) s += 5;
    }
    scored.push({ e, s });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.e);
}
