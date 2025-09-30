import Link from 'next/link';
import { Pill } from '@focusflow/ui';

export default function LifeDashboardPage() {
  return (
    <section className="mode">
      <header>
        <Pill tone="life">Life</Pill>
        <h1>Life Harmony Hub</h1>
        <p>Share rituals, coordinate templates, and celebrate mindful streaks.</p>
      </header>
      <div className="grid">
        <Link href="/life/shared" className="card">
          <h3>Shared Lists</h3>
          <p>Sync chores, groceries, and family reminders.</p>
        </Link>
        <Link href="/life/templates" className="card">
          <h3>Templates</h3>
          <p>Start from Ramadan prep, weekend plans, or festive checklists.</p>
        </Link>
        <Link href="/life/insights" className="card">
          <h3>Insights</h3>
          <p>Track collective focus streaks and wellbeing metrics.</p>
        </Link>
      </div>
      <style jsx>{`
        .mode {
          padding: 3rem 1.5rem;
          max-width: 960px;
          margin: 0 auto;
        }
        header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: rgba(255, 255, 255, 0.75);
          border-radius: 16px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 20px 40px rgba(14, 116, 144, 0.12);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(13, 148, 136, 0.2);
        }
      `}</style>
    </section>
  );
}
