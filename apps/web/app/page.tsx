import Link from 'next/link';

const modes = [
  {
    slug: 'work',
    title: 'Work Mode',
    description: 'Plan sprints, focus blocks, and deliverables without life noise.'
  },
  {
    slug: 'life',
    title: 'Life Mode',
    description: 'Coordinate family routines, shared lists, and mindful breaks.'
  }
];

export default function HomePage() {
  return (
    <main className="home">
      <section>
        <h1>FocusFlow</h1>
        <p>Seamlessly switch between work and life planning with protected focus rituals.</p>
      </section>
      <section className="modes">
        {modes.map((mode) => (
          <Link key={mode.slug} href={`/${mode.slug}`} className="mode-card">
            <h2>{mode.title}</h2>
            <p>{mode.description}</p>
          </Link>
        ))}
      </section>
      <style jsx>{`
        .home {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          padding: 4rem 1.5rem;
          text-align: center;
        }
        .modes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          width: min(960px, 100%);
        }
        .mode-card {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 16px;
          padding: 1.5rem;
          text-decoration: none;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .mode-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
        }
      `}</style>
    </main>
  );
}
