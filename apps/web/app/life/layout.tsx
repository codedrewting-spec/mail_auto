import Link from 'next/link';
import type { ReactNode } from 'react';

const links = [
  { href: '/life', label: 'Overview' },
  { href: '/life/shared', label: 'Shared Lists' },
  { href: '/life/templates', label: 'Templates' },
  { href: '/life/insights', label: 'Insights' }
];

export default function LifeLayout({ children }: { children: ReactNode }) {
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
          background: rgba(45, 212, 191, 0.8);
        }
        nav :global(a) {
          color: #0f172a;
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
