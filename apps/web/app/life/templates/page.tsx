const templates = [
  {
    name: 'Ramadan Preparation',
    checklist: ['Plan sahur menu', 'Donate to local charity', 'Evening reflection block']
  },
  {
    name: 'Weekend Family Plan',
    checklist: ['Nature walk', 'Shared focus hour', 'Meal prep']
  },
  {
    name: 'Festive Season Checklist',
    checklist: ['Gift brainstorm', 'Decor reset', 'Travel documents']
  }
];

export default function LifeTemplatesPage() {
  return (
    <section className="templates">
      <header>
        <h2>Life Templates</h2>
        <p>Kickstart rituals with curated checklists ready to assign to family members.</p>
      </header>
      <div className="grid">
        {templates.map((template) => (
          <article key={template.name} className="card">
            <h3>{template.name}</h3>
            <ul>
              {template.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <style jsx>{`
        .templates {
          padding: 3rem 1.5rem;
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .grid {
          display: grid;
          gap: 1.5rem;
        }
        .card {
          background: rgba(16, 185, 129, 0.15);
          border-radius: 16px;
          padding: 1.5rem;
        }
        ul {
          margin: 0;
          padding-left: 1.25rem;
        }
      `}</style>
    </section>
  );
}
