-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('dog', 'cat', 'bird', 'fish', 'reptile', 'rodent', 'other');

-- CreateTable
CREATE TABLE "Pet" (
    "pet_id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" VARCHAR(512) NOT NULL DEFAULT '',
    "type" "PetType" NOT NULL,
    "birthday" DATE NOT NULL,
    "country" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("pet_id")
);

-- CreateTable
CREATE TABLE "pet_photo" (
    "photo_id" SERIAL NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "photo_url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_photo_pkey" PRIMARY KEY ("photo_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pet_photo_pet_id_key" ON "pet_photo"("pet_id");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_photo" ADD CONSTRAINT "pet_photo_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("pet_id") ON DELETE CASCADE ON UPDATE CASCADE;
