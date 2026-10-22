/**
 * Content model. Lectures, questions and figures are plain typed data so new
 * material (e.g. Lecture 15) is added by dropping in a data file — no UI changes.
 * Rich text strings support **bold**, *italic*, `code`, $inline TeX$ and [links](#/path).
 */
export type RichText = string;

export interface FigureCurve {
  kind: 'line';
  from: [number, number];
  to: [number, number];
  label?: string;
  /** Data coordinates where the label is drawn (defaults near `to`). */
  labelAt?: [number, number];
  color?: string;
  dashed?: boolean;
}

export interface FigureFunction {
  kind: 'fn';
  /** Inverse-curve parameters for y = f(x); evaluated on [xFrom, xTo]. */
  fn: { type: 'poly'; coeffs: number[] } | { type: 'atc'; fixed: number; c: number; e: number };
  xFrom: number;
  xTo: number;
  label?: string;
  labelAt?: [number, number];
  color?: string;
}

export interface FigureSpec {
  xDomain: [number, number];
  yDomain: [number, number];
  xLabel: string;
  yLabel: string;
  /** Tick positions; a tick can carry a custom text label (e.g. "P1"). */
  xTicks?: (number | { v: number; label: string; dy?: number })[];
  yTicks?: (number | { v: number; label: string; dy?: number })[];
  curves?: (FigureCurve | FigureFunction)[];
  points?: { x: number; y: number; label?: string; dx?: number; dy?: number }[];
  /** Dashed guide lines from a point to both axes. */
  guides?: { x: number; y: number; toX?: boolean; toY?: boolean }[];
  regions?: { points: [number, number][]; label?: string; labelAt?: [number, number]; fill?: string }[];
  labels?: { x: number; y: number; text: string; color?: string }[];
  height?: number;
  /** Hide axes and grid (schematic diagrams such as the circular flow). */
  hideAxes?: boolean;
}

export interface TableSpec {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

export type CalloutTone = 'intuition' | 'warning' | 'exam' | 'note' | 'example' | 'key';

export type Block =
  | { type: 'p'; text: RichText }
  | { type: 'h'; text: string }
  | { type: 'list'; items: RichText[]; ordered?: boolean }
  | { type: 'definition'; term: string; text: RichText; conceptId?: string }
  | { type: 'math'; tex: string; caption?: RichText }
  | { type: 'callout'; tone: CalloutTone; title?: string; text: RichText | RichText[] }
  | { type: 'table'; table: TableSpec }
  | { type: 'model'; model: string; props?: Record<string, unknown>; caption?: RichText }
  | { type: 'example'; title: string; problem: RichText; steps: RichText[]; answer: RichText }
  | { type: 'mistakes'; items: { wrong: RichText; right: RichText }[] }
  | { type: 'check'; question: InlineQuestion }
  | { type: 'figure'; figure: FigureSpec; caption?: RichText }
  | { type: 'questions'; ids: string[]; title?: string }
  | { type: 'compare'; left: { title: string; items: RichText[] }; right: { title: string; items: RichText[] } };

/** Concept-check question authored for the platform (answer stored inline — not a source exam question). */
export interface InlineQuestion {
  prompt: RichText;
  options: RichText[];
  answer: number;
  explanation: RichText;
}

export type SectionKind = 'intro' | 'definitions' | 'math' | 'interpretation' | 'interactive' | 'example' | 'mistakes' | 'check' | 'practice' | 'recap' | 'application';

export interface Section {
  id: string;
  title: string;
  kind: SectionKind;
  blocks: Block[];
}

export interface Lecture {
  /** Stable id, e.g. "ch05". Used in storage — never rename once published. */
  id: string;
  /** Chapter number as used in the course (Mankiw numbering of the slides). */
  number: number;
  title: string;
  subtitle: string;
  estMinutes: number;
  /** Visual accent for cards. */
  color: string;
  objectives: string[];
  keywords: string[];
  sections: Section[];
  recap: RichText[];
  /** Lab model ids relevant to this lecture. */
  models: string[];
  /** Problem-set ids (content/problems) for this lecture. */
  problemSets: string[];
  /** Ids of lectures this one builds on. */
  prerequisites?: string[];
}

/** A lecture announced but not yet released (e.g. Lecture 15 before slides arrive). */
export interface UpcomingLecture {
  id: string;
  number: number;
  title: string;
  note: string;
  problemSets: string[];
  models: string[];
}

// ---------------------------------------------------------------------------
// Question bank
// ---------------------------------------------------------------------------

export type Difficulty = 1 | 2 | 3;

export interface BankQuestion {
  id: string;
  /** Where the question comes from (shown to the student). */
  source: string;
  kind: 'mcq' | 'numeric';
  stem: RichText;
  /** Optional lead-in shown before the figure (e.g. a figure title). */
  preamble?: RichText;
  /** Reconstructed figures (rendered as live SVG charts). */
  figures?: { spec: FigureSpec; caption?: string }[];
  table?: TableSpec;
  /** Text after the figure/table (the actual question). */
  question?: RichText;
  options?: RichText[];
  /** For numeric questions. */
  unit?: string;
  lectures: string[];
  topics: string[];
  difficulty: Difficulty;
  /** Options must keep their order (e.g. "all of the above"). */
  fixedOrder?: boolean;
}

export interface AnswerKeyEntry {
  /** Index into the ORIGINAL options array, or the numeric answer. */
  answer: number;
  tolerance?: number;
  explanation: RichText;
  /** 'verified' = derived and checked independently; 'review' = flagged as ambiguous. */
  status: 'verified' | 'review';
  reviewNote?: string;
}

export interface ProblemPart {
  label: string;
  prompt: RichText;
  solution: RichText;
  /** Optional numeric self-check. */
  check?: { answer: number; tolerance?: number; unit?: string };
}

export interface Problem {
  id: string;
  title: string;
  /** e.g. "Problem set Ch. 6 & 8, problem 10". */
  source: string;
  /** True when the solution comes from the course's own solution sheet. */
  officialSolution?: boolean;
  intro: RichText;
  table?: TableSpec;
  parts: ProblemPart[];
  models?: string[];
}

export interface ProblemSet {
  id: string;
  title: string;
  lectures: string[];
  problems: Problem[];
}
