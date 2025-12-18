import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PushNotificationService } from './services/push-notification.service';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { SendPushDto } from './dto/send-push.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { SendBatchDto } from './dto/send-batch.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue,
    private pushService: PushNotificationService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async sendPush(sendPushDto: SendPushDto) {
    await this.notificationQueue.add('push', sendPushDto);
    return { message: 'Push notification queued' };
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    await this.notificationQueue.add('email', sendEmailDto);
    return { message: 'Email queued' };
  }

  async sendSms(sendSmsDto: SendSmsDto) {
    await this.notificationQueue.add('sms', sendSmsDto);
    return { message: 'SMS queued' };
  }

  async sendBatch(sendBatchDto: SendBatchDto) {
    const jobs = sendBatchDto.notifications.map((notification) => ({
      data: notification,
    }));

    await this.notificationQueue.addBulk(jobs);
    return { message: 'Batch notifications queued' };
  }

  async getHistory(userId: string, limit: number) {
    // Get notification history from database
    return [];
  }

  async getTemplates() {
    // Get notification templates
    return [];
  }
}

