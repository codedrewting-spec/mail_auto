const metrics = [
  { label: 'Focus minutes (week)', value: 320 },
  { label: 'Tasks completed', value: 12 },
  { label: 'Current streak (days)', value: 5 }
];

export default function WorkInsightsPage() {
  return (
    <section className="insights">
      <header>
        <h2>Work Insights</h2>
        <p>Understand where focus time and task completion deliver the highest leverage.</p>
      </header>
      <div className="grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>
      <style jsx>{`
        .insights {
          padding: 3rem 1.5rem;
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
        }
        .card {
          padding: 1.75rem;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.25));
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        strong {
          font-size: 2rem;
        }
      `}</style>
    </section>
  );
}
