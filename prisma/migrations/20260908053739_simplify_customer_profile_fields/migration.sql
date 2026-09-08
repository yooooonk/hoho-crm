/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `customField1` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `customField2` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `customerGrade` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `customerGroup` on the `Customer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT,
    "phone" TEXT NOT NULL,
    "birthDate" DATETIME,
    "address" TEXT,
    "constitutionTag" TEXT,
    "memo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Customer" ("address", "birthDate", "constitutionTag", "createdAt", "id", "memo", "name", "phone", "updatedAt") SELECT "address", "birthDate", "constitutionTag", "createdAt", "id", "memo", "name", "phone", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
