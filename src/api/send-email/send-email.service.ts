import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from 'src/common/dto/email.dto';
import { SendEmail } from 'src/common/interfaces/sendEmail.interface';
@Injectable()
export class SendEmailService {
  private readonly logger = new Logger('mailer');
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  sendEmail({ to, text, subject }: SendEmail) {
    this.logger.log('send email');
    try {
      this.mailerService.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to,
        text,
        subject,
      });
    } catch (error) {
      this.logger.error('send email error');
      throw new InternalServerErrorException();
    }
  }

  userCreationEmail(emailDto: EmailDto) {
    const { email } = emailDto;
    return this.sendEmail({
      to: email,
      text: 'Bienvenido !',
      subject: 'subject',
    });
  }

  resetPasswordEmail(emailDto: EmailDto, token: string) {
    const { email } = emailDto;
    return this.sendEmail({
      to: email,
      text: `Token: ${token}`,
      subject: 'subject',
    });
  }
}
