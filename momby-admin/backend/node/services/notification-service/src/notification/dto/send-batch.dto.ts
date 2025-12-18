import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SendPushDto } from './send-push.dto';

export class SendBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SendPushDto)
  notifications: SendPushDto[];
}

