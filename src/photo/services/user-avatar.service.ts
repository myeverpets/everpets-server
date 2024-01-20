import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';

export class UserAvatarService {
  private readonly s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
  }

  public async uploadAvatar(file: Buffer) {
    try {
      const key = v4();
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_USER_PHOTO_NAME,
          Key: key,
          Body: file,
          ContentType: 'image',
          ACL: 'public-read',
        }),
      );
      return {
        key,
        url: `https://${process.env.AWS_S3_BUCKET_USER_PHOTO_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`,
      };
    } catch (error) {
      return false;
    }
  }

  public async deleteAvatar(key: string) {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_USER_PHOTO_NAME,
          Key: key,
        }),
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
