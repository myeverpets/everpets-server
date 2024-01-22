import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { PetType } from '@prisma/client';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(PetType)
  type: PetType;

  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional() // change;
  ownerId: number;
}
