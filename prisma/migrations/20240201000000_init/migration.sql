-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "TaskSpace" AS ENUM ('WORK', 'LIFE');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "TaskStatus" AS ENUM ('BACKLOG', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "FocusStatus" AS ENUM ('COMPLETED', 'INTERRUPTED', 'TIMEOUT');
CREATE TYPE "PointsReason" AS ENUM ('FOCUS_COMPLETED', 'TASK_COMPLETED');
CREATE TYPE "PointsSourceType" AS ENUM ('FOCUS_SESSION', 'TASK');
CREATE TYPE "BadgeType" AS ENUM ('SEVEN_DAY_STREAK');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL UNIQUE,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streakCurrent" INTEGER NOT NULL DEFAULT 0,
    "streakLongest" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "Project" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "space" "TaskSpace" NOT NULL,
    "defaultCalendar" TEXT,
    "ownerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Task" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueAt" TIMESTAMP(3),
    "estimateMinutes" INTEGER,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "space" "TaskSpace" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'BACKLOG',
    "completedAt" TIMESTAMP(3),
    "projectId" UUID,
    "ownerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Subtask" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "taskId" UUID NOT NULL REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "DailyFocusSummary" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "chainEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "chainTxHash" TEXT,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DailyFocusSummary_user_date_unique" UNIQUE ("userId", "date")
);

CREATE TABLE "FocusSession" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "interruptions" INTEGER NOT NULL DEFAULT 0,
    "deviceId" TEXT NOT NULL,
    "status" "FocusStatus" NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "taskId" UUID,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "summaryId" UUID REFERENCES "DailyFocusSummary"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FocusSession_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "PointsLedger" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "points" INTEGER NOT NULL,
    "reason" "PointsReason" NOT NULL,
    "sourceType" "PointsSourceType" NOT NULL,
    "sourceId" UUID NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PointsLedger_source_unique" UNIQUE ("sourceType", "sourceId")
);

CREATE TABLE "Badge" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "badgeType" "BadgeType" NOT NULL,
    "periodRoot" TEXT NOT NULL,
    "chainEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "chainTxHash" TEXT,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "summaryId" UUID REFERENCES "DailyFocusSummary"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "SharedList" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "space" "TaskSpace" NOT NULL DEFAULT 'LIFE',
    "ownerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "sharedWith" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE "SharedListItem" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "assigneeEmail" TEXT,
    "listId" UUID NOT NULL REFERENCES "SharedList"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "SharedTemplate" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "items" JSONB NOT NULL
);

-- Indexes
CREATE INDEX "FocusSession_user_start_idx" ON "FocusSession" ("userId", "start");
