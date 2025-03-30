/*
  Warnings:

  - You are about to alter the column `balance` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "pixi" TEXT NOT NULL,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "balance" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Account_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("balance", "clientId", "id", "pixi", "suspended") SELECT "balance", "clientId", "id", "pixi", "suspended" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_clientId_key" ON "Account"("clientId");
CREATE UNIQUE INDEX "Account_pixi_key" ON "Account"("pixi");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
