const sharedLists = [
  { name: 'Weekly Groceries', members: 3, items: 18 },
  { name: 'Family Chores', members: 4, items: 9 }
];

export default function LifeSharedListsPage() {
  return (
    <section className="lists">
      <header>
        <h2>Shared Lists</h2>
        <p>Share responsibilities without leaking into work focus time.</p>
      </header>
      <div className="grid">
        {sharedLists.map((list) => (
          <article key={list.name} className="card">
            <h3>{list.name}</h3>
            <p>{list.items} items • {list.members} members</p>
          </article>
        ))}
      </div>
      <style jsx>{`
        .lists {
          padding: 3rem 1.5rem;
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: rgba(125, 211, 252, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
        }
      `}</style>
    </section>
  );
}
