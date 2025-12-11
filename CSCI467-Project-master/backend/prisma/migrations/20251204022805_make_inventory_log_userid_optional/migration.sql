-- DropForeignKey
ALTER TABLE "public"."inventory_logs" DROP CONSTRAINT "inventory_logs_userId_fkey";

-- AlterTable
ALTER TABLE "public"."inventory_logs" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."inventory_logs" ADD CONSTRAINT "inventory_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
