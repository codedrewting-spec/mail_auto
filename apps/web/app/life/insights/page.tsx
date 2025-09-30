const metrics = [
  { label: 'Family streak (days)', value: 4 },
  { label: 'Shared tasks done', value: 16 },
  { label: 'Focus minutes (life)', value: 210 }
];

export default function LifeInsightsPage() {
  return (
    <section className="insights">
      <header>
        <h2>Life Insights</h2>
        <p>Celebrate collective achievements and keep motivation high.</p>
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
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.1));
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
