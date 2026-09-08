-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthDate" DATETIME,
    "constitutionTag" TEXT,
    "customerGroup" TEXT NOT NULL DEFAULT '신규',
    "customerGrade" TEXT NOT NULL DEFAULT '일반',
    "assignedTo" TEXT,
    "address" TEXT,
    "customField1" TEXT,
    "customField2" TEXT,
    "memo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Customer" ("birthDate", "constitutionTag", "createdAt", "id", "memo", "name", "phone", "updatedAt") SELECT "birthDate", "constitutionTag", "createdAt", "id", "memo", "name", "phone", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
