/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "firstName" TEXT DEFAULT '',
    "lastName" TEXT DEFAULT '',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
