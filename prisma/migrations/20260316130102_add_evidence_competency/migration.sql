-- CreateTable
CREATE TABLE "EvidenceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evidenceItemId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "assessorVerdict" TEXT,
    "filePath" TEXT,
    "fileName" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "studentId" TEXT NOT NULL,
    CONSTRAINT "EvidenceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompetencyRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unitCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assessorId" TEXT,
    "decidedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "studentId" TEXT NOT NULL,
    CONSTRAINT "CompetencyRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceRecord_studentId_evidenceItemId_key" ON "EvidenceRecord"("studentId", "evidenceItemId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyRecord_studentId_unitCode_key" ON "CompetencyRecord"("studentId", "unitCode");
