import Link from 'next/link';
import type { ReactNode } from 'react';

const links = [
  { href: '/work', label: 'Overview' },
  { href: '/work/tasks', label: 'Tasks' },
  { href: '/work/focus', label: 'Focus' },
  { href: '/work/insights', label: 'Insights' }
];

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <nav>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="content">{children}</div>
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        nav {
          display: flex;
          gap: 1rem;
          padding: 1rem 2rem;
          background: rgba(15, 23, 42, 0.9);
        }
        nav :global(a) {
          color: #f8fafc;
          text-decoration: none;
          font-weight: 600;
        }
        .content {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
