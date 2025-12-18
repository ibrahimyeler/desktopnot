import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SendPushDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  data?: any;
}

