import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
  imports: [DatabaseModule, NotificationModule, S3UploaderModule],
})
export class UserModule {}
