/*
  Warnings:

  - A unique constraint covering the columns `[path,bucket]` on the table `file` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "file_path_bucket_key" ON "file"("path", "bucket");
