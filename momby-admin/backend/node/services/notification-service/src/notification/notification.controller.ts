import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendPushDto } from './dto/send-push.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { SendBatchDto } from './dto/send-batch.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('push')
  async sendPush(@Body() sendPushDto: SendPushDto) {
    return this.notificationService.sendPush(sendPushDto);
  }

  @Post('email')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.notificationService.sendEmail(sendEmailDto);
  }

  @Post('sms')
  async sendSms(@Body() sendSmsDto: SendSmsDto) {
    return this.notificationService.sendSms(sendSmsDto);
  }

  @Post('batch')
  async sendBatch(@Body() sendBatchDto: SendBatchDto) {
    return this.notificationService.sendBatch(sendBatchDto);
  }

  @Get('history')
  async getHistory(@Query('userId') userId: string, @Query('limit') limit: number = 20) {
    return this.notificationService.getHistory(userId, limit);
  }

  @Get('templates')
  async getTemplates() {
    return this.notificationService.getTemplates();
  }
}

