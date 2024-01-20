import { Module } from '@nestjs/common';
import { UserAvatarService } from './services/user-avatar.service';

@Module({
  providers: [UserAvatarService],
  exports: [UserAvatarService],
})
export class PhotoModule {}
