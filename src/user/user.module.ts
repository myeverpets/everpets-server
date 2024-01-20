import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserController } from './user.controller';
import { SnsModule } from 'src/sns/sns.module';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
  imports: [DatabaseModule, MailerModule, SnsModule, PhotoModule],
})
export class UserModule {}
