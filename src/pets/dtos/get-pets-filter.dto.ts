import { PetType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class GetPetsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(PetType)
  type: string;

  @IsOptional()
  @IsNumber()
  ownerId: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsNumberString()
  limit: number;

  @IsOptional()
  @IsNumberString()
  offset: number;
}
