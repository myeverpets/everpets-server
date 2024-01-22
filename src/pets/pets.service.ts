import { Injectable } from '@nestjs/common';
import { Pet } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UpdatePetDto } from './dtos/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllPets(): Promise<Pet[]> {
    return this.prismaService.pet.findMany();
  }

  public async getPetById(id: number): Promise<Pet | null> {
    return this.prismaService.pet.findUnique({
      where: { petId: id },
    });
  }

  public async getPetsWithFilters(filterDto: any): Promise<Pet[] | []> {
    const filteredWhere = Object.fromEntries(
      Object.entries(filterDto).filter(
        ([k, v]) => v !== undefined && k !== 'limit' && k !== 'offset',
      ),
    );
    return this.prismaService.pet.findMany({
      where: filteredWhere,
      take: +filterDto.limit || undefined,
      skip: +filterDto.offset || undefined,
    });
  }

  public async createPet(createPetDto: CreatePetDto): Promise<Pet> {
    return this.prismaService.pet.create({
      data: {
        name: createPetDto.name,
        petType: createPetDto.type,
        ownerId: createPetDto.ownerId,
        birthday: new Date(createPetDto.birthdate),
        country: createPetDto.country,
        description: createPetDto.description,
      },
    });
  }

  public async updatePet(
    id: string,
    ownerId: number,
    updatePetDto: UpdatePetDto,
  ): Promise<Pet> {
    const updatedFields = Object.fromEntries(
      Object.entries(updatePetDto).filter(([, v]) => v !== undefined),
    );
    return this.prismaService.pet.update({
      where: { petId: +id, ownerId },
      data: {
        ...updatedFields,
      },
    });
  }

  public async deletePet(id: string, ownerId: number): Promise<Pet> {
    return this.prismaService.pet.delete({
      where: { petId: +id, ownerId },
    });
  }
}
