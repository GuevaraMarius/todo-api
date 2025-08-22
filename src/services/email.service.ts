import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const msg = {
      to,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }
}
