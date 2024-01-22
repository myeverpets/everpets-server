import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { Pet } from '@prisma/client';
import { GetPetsFilterDto } from './dtos/get-pets-filter.dto';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePetDto } from './dtos/update-pet.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  public async getPets(
    @Query() filterDto: GetPetsFilterDto,
  ): Promise<Pet[] | []> {
    console.log(filterDto);
    if (Object.keys(filterDto).length) {
      return this.petsService.getPetsWithFilters(filterDto);
    }
    return this.petsService.getAllPets();
  }

  @Get(':id')
  public async getPetById(@Param('id') id: number): Promise<Pet | null> {
    return this.petsService.getPetById(id);
  }

  @UseGuards(AuthGuard('access'))
  @Post()
  public async createPet(
    @Body() createPetDto: CreatePetDto,
    @Req() req,
  ): Promise<Pet> {
    const ownerId = req.user.userId;
    return this.petsService.createPet({ ...createPetDto, ownerId });
  }

  @UseGuards(AuthGuard('access'))
  @Put(':id')
  public async updatePet(
    @Param('id') id: string,
    @Req() req,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    const ownerId = req.user.userId;
    return this.petsService.updatePet(id, ownerId, updatePetDto);
  }

  @UseGuards(AuthGuard('access'))
  @Delete(':id')
  public async deletePet(@Param('id') id: string, @Req() req) {
    const ownerId = req.user.userId;
    return this.petsService.deletePet(id, ownerId);
  }
}
