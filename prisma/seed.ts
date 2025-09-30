import {
  BadgeType,
  FocusStatus,
  PointsReason,
  PointsSourceType,
  PrismaClient,
  TaskPriority,
  TaskSpace,
  TaskStatus
} from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'founder@focusflow.app' },
    update: {},
    create: {
      email: 'founder@focusflow.app',
      displayName: 'FocusFlow Founder'
    }
  });

  const workProject = await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {
      title: 'Deep Work Sprint',
      space: TaskSpace.WORK,
      ownerId: user.id
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Deep Work Sprint',
      description: 'Weekly cycle for the most important deliverables',
      space: TaskSpace.WORK,
      ownerId: user.id
    }
  });

  const lifeProject = await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {
      title: 'Family Harmony',
      space: TaskSpace.LIFE,
      ownerId: user.id
    },
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Family Harmony',
      description: 'Shared rituals and personal routines for rest days',
      space: TaskSpace.LIFE,
      ownerId: user.id
    }
  });

  const workTask = await prisma.task.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      title: 'Ship focus analytics prototype',
      description: 'Create weekly/monthly dashboards for focus habits.',
      priority: TaskPriority.HIGH,
      tags: ['focus', 'analytics'],
      space: TaskSpace.WORK,
      status: TaskStatus.IN_PROGRESS,
      estimateMinutes: 240,
      ownerId: user.id,
      projectId: workProject.id,
      subtasks: {
        create: [
          {
            title: 'Design data model',
            isCompleted: true
          },
          {
            title: 'Implement aggregation service',
            isCompleted: false
          }
        ]
      }
    }
  });

  const lifeTask = await prisma.task.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      title: 'Plan Ramadan family prep checklist',
      description: 'Groceries, decorations and shared responsibilities.',
      priority: TaskPriority.MEDIUM,
      tags: ['family', 'ramadan'],
      space: TaskSpace.LIFE,
      status: TaskStatus.BACKLOG,
      ownerId: user.id,
      projectId: lifeProject.id,
      subtasks: {
        create: [
          { title: 'Draft grocery list' },
          { title: 'Coordinate volunteer slots' }
        ]
      }
    }
  });

  const focusStart = new Date();
  focusStart.setUTCHours(5, 0, 0, 0);
  const focusEnd = new Date(focusStart.getTime() + 50 * 60 * 1000);
  const durationMinutes = Math.round((focusEnd.getTime() - focusStart.getTime()) / (60 * 1000));

  const session = await prisma.focusSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      start: focusStart,
      end: focusEnd,
      interruptions: 1,
      deviceId: 'web-client-seed',
      status: FocusStatus.COMPLETED,
      durationMinutes,
      userId: user.id,
      taskId: workTask.id
    }
  });

  const isoDate = new Date(focusStart);
  isoDate.setUTCHours(0, 0, 0, 0);

  const merkleRoot = computeMerkleRoot([
    `${session.id}:${session.taskId}:${session.start.toISOString()}:${session.end.toISOString()}:${session.interruptions}`
  ]);

  const summary = await prisma.dailyFocusSummary.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: isoDate
      }
    },
    update: {
      merkleRoot
    },
    create: {
      userId: user.id,
      date: isoDate,
      merkleRoot,
      chainEnabled: false
    }
  });

  await prisma.focusSession.update({
    where: { id: session.id },
    data: {
      summaryId: summary.id
    }
  });

  await prisma.pointsLedger.upsert({
    where: {
      sourceType_sourceId: {
        sourceType: PointsSourceType.FOCUS_SESSION,
        sourceId: session.id
      }
    },
    update: {},
    create: {
      points: 3,
      reason: PointsReason.FOCUS_COMPLETED,
      sourceType: PointsSourceType.FOCUS_SESSION,
      sourceId: session.id,
      userId: user.id
    }
  });

  await prisma.pointsLedger.upsert({
    where: {
      sourceType_sourceId: {
        sourceType: PointsSourceType.TASK,
        sourceId: workTask.id
      }
    },
    update: {},
    create: {
      points: 5,
      reason: PointsReason.TASK_COMPLETED,
      sourceType: PointsSourceType.TASK,
      sourceId: workTask.id,
      userId: user.id
    }
  });

  await prisma.badge.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      badgeType: BadgeType.SEVEN_DAY_STREAK,
      periodRoot: merkleRoot,
      chainEnabled: false,
      userId: user.id,
      summaryId: summary.id
    }
  });

  await prisma.sharedList.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      title: 'Family Weekend Rituals',
      space: TaskSpace.LIFE,
      ownerId: user.id,
      sharedWith: ['partner@focusflow.app'],
      items: {
        create: [
          { title: 'Prep picnic basket' },
          { title: 'Confirm grandparents video call' }
        ]
      }
    }
  });

  await prisma.sharedTemplate.upsert({
    where: { slug: 'ramadan-prep' },
    update: {},
    create: {
      slug: 'ramadan-prep',
      title: 'Ramadan Preparation',
      description: 'Checklist to prepare for the holy month.',
      locale: 'en',
      items: JSON.parse(
        JSON.stringify([
          { title: 'Stock dates and tea' },
          { title: 'Prepare prayer space' },
          { title: 'Schedule community outreach' }
        ])
      )
    }
  });

  await prisma.sharedTemplate.upsert({
    where: { slug: 'weekend-refresh' },
    update: {},
    create: {
      slug: 'weekend-refresh',
      title: 'Weekend Reset',
      description: 'Life admin reset for the weekend.',
      locale: 'en',
      items: JSON.parse(
        JSON.stringify([
          { title: 'Declutter shared spaces' },
          { title: 'Review kids activities' },
          { title: 'Prep meals for Monday' }
        ])
      )
    }
  });

  await prisma.sharedTemplate.upsert({
    where: { slug: 'festive-essentials' },
    update: {},
    create: {
      slug: 'festive-essentials',
      title: 'Festive Essentials',
      description: 'Chinese New Year reunion prep highlights.',
      locale: 'zh',
      items: JSON.parse(
        JSON.stringify([
          { title: '采买年货' },
          { title: '准备红包' },
          { title: '发送团圆邀请' }
        ])
      )
    }
  });
}

function computeMerkleRoot(leaves: string[]): string {
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
        createHash('sha256').update(Buffer.from(left + right, 'hex')).digest('hex')
      );
    }
    level = nextLevel;
  }

  return '0x' + level[0];
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
