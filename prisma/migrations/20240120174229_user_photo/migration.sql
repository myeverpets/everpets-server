-- CreateTable
CREATE TABLE "user_photo" (
    "photo_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "photo_url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_photo_pkey" PRIMARY KEY ("photo_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_photo_user_id_key" ON "user_photo"("user_id");

-- AddForeignKey
ALTER TABLE "user_photo" ADD CONSTRAINT "user_photo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
