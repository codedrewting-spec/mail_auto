import { z } from 'zod';

export const TaskSpaceSchema = z.enum(['work', 'life']);
export type TaskSpace = z.infer<typeof TaskSpaceSchema>;

export const TaskPrioritySchema = z.enum(['low', 'medium', 'high']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const TaskStatusSchema = z.enum(['backlog', 'in_progress', 'completed', 'archived']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  space: TaskSpaceSchema,
  defaultCalendar: z.string().optional(),
  ownerId: z.string().uuid().optional()
});
export type Project = z.infer<typeof ProjectSchema>;

export const SubtaskSchema = z.object({
  id: z.string().uuid().optional(),
  taskId: z.string().uuid(),
  title: z.string().min(1),
  isCompleted: z.boolean().default(false),
  due: z.string().datetime().nullable().optional()
});
export type Subtask = z.infer<typeof SubtaskSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid().optional(),
  projectId: z.string().uuid().nullable(),
  title: z.string().min(1),
  description: z.string().optional(),
  due: z.string().datetime().nullable(),
  estimateMinutes: z.number().int().min(0).nullable(),
  priority: TaskPrioritySchema.default('medium'),
  tags: z.array(z.string()).default([]),
  space: TaskSpaceSchema,
  status: TaskStatusSchema.default('backlog'),
  subtasks: z.array(SubtaskSchema).optional()
});
export type Task = z.infer<typeof TaskSchema>;

export const FocusStatusSchema = z.enum(['completed', 'interrupted', 'timeout']);
export type FocusStatus = z.infer<typeof FocusStatusSchema>;

export const FocusSessionSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  taskId: z.string().uuid().nullable(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  interruptions: z.number().int().min(0),
  deviceId: z.string(),
  status: FocusStatusSchema,
  durationMinutes: z.number().int().min(1).optional()
});
export type FocusSession = z.infer<typeof FocusSessionSchema>;

export const DailyFocusSummarySchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  merkleRoot: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  chainEnabled: z.boolean().default(false),
  chainTxHash: z.string().nullable().optional()
});
export type DailyFocusSummary = z.infer<typeof DailyFocusSummarySchema>;

export const ProofOfFocusEventSchema = z.object({
  sessions: z.array(FocusSessionSchema),
  merkleRoot: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  chainEnabled: z.boolean()
});
export type ProofOfFocusEvent = z.infer<typeof ProofOfFocusEventSchema>;

export const PointsReasonSchema = z.enum(['focus_completed', 'task_completed']);
export type PointsReason = z.infer<typeof PointsReasonSchema>;

export const PointsAwardSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  reason: PointsReasonSchema,
  points: z.number().int().positive(),
  sourceType: z.enum(['focus_session', 'task']),
  sourceId: z.string().uuid(),
  awardedAt: z.string().datetime()
});
export type PointsAward = z.infer<typeof PointsAwardSchema>;

export const BadgeTypeSchema = z.enum(['seven_day_streak']);
export type BadgeType = z.infer<typeof BadgeTypeSchema>;

export const BadgeSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  badgeType: BadgeTypeSchema,
  awardedAt: z.string().datetime(),
  periodRoot: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  chainEnabled: z.boolean(),
  chainTxHash: z.string().nullable().optional()
});
export type Badge = z.infer<typeof BadgeSchema>;

export const SharedListSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  ownerId: z.string().uuid(),
  space: TaskSpaceSchema.default('life'),
  sharedWith: z.array(z.string().email()).default([])
});
export type SharedList = z.infer<typeof SharedListSchema>;

export const SharedListItemSchema = z.object({
  id: z.string().uuid().optional(),
  listId: z.string().uuid(),
  title: z.string().min(1),
  notes: z.string().optional(),
  isCompleted: z.boolean().default(false),
  assigneeEmail: z.string().email().nullable().optional()
});
export type SharedListItem = z.infer<typeof SharedListItemSchema>;

export const SharedTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  items: z.array(z.object({ title: z.string(), notes: z.string().optional() })),
  locale: z.enum(['en', 'bm', 'zh']).default('en')
});
export type SharedTemplate = z.infer<typeof SharedTemplateSchema>;

export const FocusStreakSchema = z.object({
  userId: z.string().uuid(),
  current: z.number().int().nonnegative(),
  longest: z.number().int().nonnegative()
});
export type FocusStreak = z.infer<typeof FocusStreakSchema>;

export const DailyFocusMetricSchema = z.object({
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  focusMinutes: z.number().int().nonnegative()
});
export type DailyFocusMetric = z.infer<typeof DailyFocusMetricSchema>;

export const StatsOverviewSchema = z.object({
  userId: z.string().uuid(),
  week: z.object({ focusMinutes: z.number().int().nonnegative(), completedTasks: z.number().int().nonnegative() }),
  month: z.object({ focusMinutes: z.number().int().nonnegative(), completedTasks: z.number().int().nonnegative() }),
  consecutiveDays: z.number().int().nonnegative(),
  lastSevenDays: z.array(DailyFocusMetricSchema)
});
export type StatsOverview = z.infer<typeof StatsOverviewSchema>;
