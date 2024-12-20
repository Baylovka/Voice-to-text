-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkUserId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");
