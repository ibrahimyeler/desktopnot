import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async send(data: any) {
    const { to, subject, text, html, templateId, templateData } = data;

    const msg: any = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@momby.com',
      subject,
    };

    if (templateId) {
      msg.templateId = templateId;
      msg.dynamicTemplateData = templateData;
    } else {
      msg.text = text;
      msg.html = html;
    }

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

