/*
  Warnings:

  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Server` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Channel";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Server";

-- DropEnum
DROP TYPE "ChannelType";

-- DropEnum
DROP TYPE "MemberRole";
