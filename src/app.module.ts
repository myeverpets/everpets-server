import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { S3UploaderModule } from './s3-uploader/s3-uploader.module';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    NotificationModule,
    S3UploaderModule,
    PetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
