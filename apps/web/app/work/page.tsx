import Link from 'next/link';
import { Pill } from '@focusflow/ui';

export default function WorkDashboardPage() {
  return (
    <section className="mode">
      <header>
        <Pill tone="work">Work</Pill>
        <h1>Work Control Center</h1>
        <p>Organize projects, schedule focus blocks, and review performance trends.</p>
      </header>
      <div className="grid">
        <Link href="/work/tasks" className="card">
          <h3>Tasks</h3>
          <p>Plan tasks with due dates, estimates, and tags.</p>
        </Link>
        <Link href="/work/focus" className="card">
          <h3>Focus</h3>
          <p>Spin up 25/50 minute sessions and capture Proof-of-Focus metadata.</p>
        </Link>
        <Link href="/work/insights" className="card">
          <h3>Insights</h3>
          <p>Monitor streaks, earned points, and weekly deep work minutes.</p>
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
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
        }
      `}</style>
    </section>
  );
}
