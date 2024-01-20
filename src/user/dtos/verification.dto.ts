import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificationDto {
  @ApiProperty({ example: '12aw4s3' })
  @IsNotEmpty()
  @Length(8, 8)
  @IsString()
  token: string;
}
