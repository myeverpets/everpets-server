import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { DatabaseModule } from '../database/database.module';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';

@Module({
  providers: [PetsService],
  controllers: [PetsController],
  exports: [PetsService],
  imports: [DatabaseModule, S3UploaderModule],
})
export class PetsModule {}
