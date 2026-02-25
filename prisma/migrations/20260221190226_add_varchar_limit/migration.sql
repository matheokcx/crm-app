/*
  Warnings:

  - You are about to alter the column `firstName` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `lastName` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `job` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `mail` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `text` on the `ClientNote` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `title` on the `Meeting` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `Meeting` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `title` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `description` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "job" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "mail" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "ClientNote" ALTER COLUMN "text" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "title" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(300);
