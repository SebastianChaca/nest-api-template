import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DEVELOPMENT, NODE_ENV } from 'src/common/constants/envvars';
import { AuthModule } from '../auth/auth.module';
@Module({
  controllers: [SendEmailController],
  providers: [SendEmailService],
  imports: [
    AuthModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (configService.get(NODE_ENV) === DEVELOPMENT) {
          return {
            transport: {
              host: 'smtp.freesmtpservers.com',
              port: 25,
            },
          };
        }
      },
    }),
  ],
  exports: [SendEmailService],
})
export class SendEmailModule {}
