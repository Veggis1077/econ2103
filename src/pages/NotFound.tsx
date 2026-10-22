import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="font-serif text-6xl font-semibold text-ink-300">404</div>
      <p className="mt-3 text-ink-600 dark:text-ink-300">This page is not in equilibrium — it doesn’t exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to dashboard</Link>
    </div>
  );
}
