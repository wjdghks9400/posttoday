-- CreateTable
CREATE TABLE "OneLine" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "nickname" TEXT,
    "body" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OneLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OneLine_eventId_idx" ON "OneLine"("eventId");

-- CreateIndex
CREATE INDEX "OneLine_ipHash_idx" ON "OneLine"("ipHash");

-- CreateIndex
CREATE INDEX "OneLine_createdAt_idx" ON "OneLine"("createdAt");

-- CreateIndex
CREATE INDEX "OneLine_deletedAt_idx" ON "OneLine"("deletedAt");

-- AddForeignKey
ALTER TABLE "OneLine" ADD CONSTRAINT "OneLine_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
