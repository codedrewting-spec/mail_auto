import { Pill } from '@focusflow/ui';

const sampleTasks = [
  {
    title: 'Draft product spec',
    estimate: '90m',
    tags: ['product', 'deep work'],
    priority: 'High'
  },
  {
    title: 'Sync with design partners',
    estimate: '45m',
    tags: ['meeting'],
    priority: 'Medium'
  }
];

export default function WorkTasksPage() {
  return (
    <section className="tasks">
      <header className="page-header">
        <h2>Task Planning</h2>
        <p>Organize projects → tasks → subtasks with work defaults and points rewards.</p>
      </header>
      <div className="list">
        {sampleTasks.map((task) => (
          <article key={task.title} className="card">
            <header className="card-header">
              <h3>{task.title}</h3>
              <Pill tone="work">{task.priority}</Pill>
            </header>
            <footer>
              <span>{task.estimate}</span>
              <div className="tags">
                {task.tags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
            </footer>
          </article>
        ))}
      </div>
      <style jsx>{`
        .tasks {
          padding: 3rem 1.5rem;
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .list {
          display: grid;
          gap: 1.5rem;
        }
        .card {
          background: rgba(15, 23, 42, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tags {
          display: flex;
          gap: 0.5rem;
        }
      `}</style>
    </section>
  );
}
