-- Add dashboard/statistics fields to core tables and create daily stats table
ALTER TABLE "User" ADD COLUMN "totalFocusSeconds" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "totalDistractedSeconds" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "weeklyFocusSeconds" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "currentStreakDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "longestStreakDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lastFocusDate" DATETIME;
ALTER TABLE "User" ADD COLUMN "totalSessions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "completedTasks" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Task" ADD COLUMN "completedAt" DATETIME;
ALTER TABLE "Task" ADD COLUMN "focusDurationSeconds" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Task" ADD COLUMN "distractionDurationSeconds" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "FocusSession" ADD COLUMN "focusDurationSeconds" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "FocusSession" ADD COLUMN "distractionDurationSeconds" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "FocusSession" ADD COLUMN "interruptionCount" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "FocusDailyStat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "focusDurationSeconds" INTEGER NOT NULL DEFAULT 0,
    "distractionDurationSeconds" INTEGER NOT NULL DEFAULT 0,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "FocusDailyStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "FocusDailyStat_userId_date_key" ON "FocusDailyStat"("userId", "date");
CREATE INDEX "FocusDailyStat_userId_idx" ON "FocusDailyStat"("userId");
