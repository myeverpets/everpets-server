-- DropForeignKey
ALTER TABLE "email_verification" DROP CONSTRAINT "email_verification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "phone_verification" DROP CONSTRAINT "phone_verification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_photo" DROP CONSTRAINT "user_photo_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_photo" ADD CONSTRAINT "user_photo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_verification" ADD CONSTRAINT "phone_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
