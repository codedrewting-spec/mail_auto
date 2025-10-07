import { createHash } from 'crypto';

export function computeMerkleRoot(leaves: string[]): string {
  if (leaves.length === 0) {
    return '0x' + '0'.repeat(64);
  }

  let level = leaves.map((value) =>
    createHash('sha256').update(value).digest('hex')
  );

  while (level.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      nextLevel.push(
        createHash('sha256')
          .update(Buffer.from(left + right, 'hex'))
          .digest('hex')
      );
    }
    level = nextLevel;
  }

  return '0x' + level[0];
}

export function focusSessionLeaf(session: {
  id: string;
  taskId: string | null;
  start: Date;
  end: Date;
  interruptions: number;
}): string {
  return [
    session.id,
    session.taskId ?? 'unassigned',
    session.start.toISOString(),
    session.end.toISOString(),
    session.interruptions.toString()
  ].join(':');
}
