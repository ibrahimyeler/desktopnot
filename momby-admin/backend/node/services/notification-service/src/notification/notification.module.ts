import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PushNotificationService } from './services/push-notification.service';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    PushNotificationService,
    EmailService,
    SmsService,
    NotificationProcessor,
  ],
})
export class NotificationModule {}

