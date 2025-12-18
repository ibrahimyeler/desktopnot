import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PushNotificationService } from './services/push-notification.service';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';

@Processor('notifications')
export class NotificationProcessor {
  constructor(
    private pushService: PushNotificationService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  @Process('push')
  async handlePush(job: Job) {
    await this.pushService.send(job.data);
  }

  @Process('email')
  async handleEmail(job: Job) {
    await this.emailService.send(job.data);
  }

  @Process('sms')
  async handleSms(job: Job) {
    await this.smsService.send(job.data);
  }
}

