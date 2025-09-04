/*
  Warnings:

  - You are about to drop the column `accepted` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `appealId` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `confidence` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `moderatorId` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `suggestionId` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `usedInJobId` on the `AITrainingExample` table. All the data in the column will be lost.
  - You are about to drop the column `actorId` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the `AIAssistLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AIFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModerationAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PdfExport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetrainJob` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `AITrainingExample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_actorId_fkey";

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_userId_fkey";

-- DropForeignKey
ALTER TABLE "PdfExport" DROP CONSTRAINT "PdfExport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "PdfExport" DROP CONSTRAINT "PdfExport_userId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- AlterTable
ALTER TABLE "AITrainingExample" DROP COLUMN "accepted",
DROP COLUMN "appealId",
DROP COLUMN "category",
DROP COLUMN "comments",
DROP COLUMN "confidence",
DROP COLUMN "createdAt",
DROP COLUMN "moderatorId",
DROP COLUMN "reviewedAt",
DROP COLUMN "suggestionId",
DROP COLUMN "usedInJobId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "actorId",
DROP COLUMN "userId",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "actor" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "detail" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "subscriptionStatus" TEXT DEFAULT 'inactive';

-- DropTable
DROP TABLE "AIAssistLog";

-- DropTable
DROP TABLE "AIFeedback";

-- DropTable
DROP TABLE "ModerationAction";

-- DropTable
DROP TABLE "PdfExport";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "RetrainJob";

-- CreateTable
CREATE TABLE "ForecastLog" (
    "id" TEXT NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "results" JSONB NOT NULL,

    CONSTRAINT "ForecastLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLATask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "assignedTeam" TEXT,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SLATask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLASettings" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "SLASettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionModel" (
    "id" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "deployedBy" TEXT,
    "deployedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "ProductionModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionModel_modelVersion_key" ON "ProductionModel"("modelVersion");

-- AddForeignKey
ALTER TABLE "AITrainingExample" ADD CONSTRAINT "AITrainingExample_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
