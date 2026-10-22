import type { TableSpec } from '../../types/content';
import { Rich } from '../ui/Rich';

export function DataTable({ table }: { table: TableSpec }) {
  return (
    <figure className="my-2 overflow-x-auto">
      {table.caption && <figcaption className="mb-2 text-sm font-medium text-ink-600 dark:text-ink-300"><Rich text={table.caption} /></figcaption>}
      <table className="min-w-full overflow-hidden rounded-xl border border-ink-200 text-sm dark:border-ink-700">
        <thead className="bg-ink-50 dark:bg-ink-800">
          <tr>{table.headers.map((h, i) => <th key={i} className="px-3 py-2 text-left font-semibold text-ink-700 dark:text-ink-200"><Rich text={h} /></th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i} className="border-t border-ink-100 dark:border-ink-800">
              {r.map((c, j) => <td key={j} className={`px-3 py-1.5 ${typeof c === 'number' ? 'font-mono tabular-nums' : ''} ${j === 0 ? 'font-medium' : ''}`}><Rich text={String(c)} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
