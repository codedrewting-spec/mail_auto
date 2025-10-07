import type { PropsWithChildren } from 'react';

export type PillTone = 'work' | 'life' | 'neutral';

const toneStyles: Record<PillTone, string> = {
  work: 'background: rgba(59,130,246,0.1); color: #1d4ed8;',
  life: 'background: rgba(16,185,129,0.1); color: #047857;',
  neutral: 'background: rgba(15,23,42,0.06); color: #0f172a;'
};

export function Pill({ tone = 'neutral', children }: PropsWithChildren<{ tone?: PillTone }>) {
  return (
    <span
      style={{
        borderRadius: '9999px',
        padding: '0.35rem 0.75rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        ...(Object.fromEntries(
          toneStyles[tone]
            .split(';')
            .filter(Boolean)
            .map((rule) => {
              const [property, value] = rule.split(':').map((part) => part.trim());
              const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
              return [camelCaseProperty, value];
            })
        ) as Record<string, string>)
      }}
    >
      {children}
    </span>
  );
}
