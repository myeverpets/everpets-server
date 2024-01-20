-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_phone_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "phone_verification" (
    "phone_code_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phone_verification_pkey" PRIMARY KEY ("phone_code_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "phone_verification_user_id_key" ON "phone_verification"("user_id");

-- AddForeignKey
ALTER TABLE "phone_verification" ADD CONSTRAINT "phone_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
