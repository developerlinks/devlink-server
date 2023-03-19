import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { getServerConfig } from 'ormconfig';
import { getChineseTemplate } from './template';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(to: string): Promise<void> {
    // TODO: 记录 IP 一小时限制请求 10 次
    const config = getServerConfig();
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    try {
      await this.mailerService.sendMail({
        to,
        from: config['user'] as string,
        subject: 'devlink 验证码',
        html: getChineseTemplate(code, getCurrentTime()),
      });
      console.info('send code success');
    } catch (error) {
      console.info('error: ', error);
    }
  }
}

/**
 * 获取当前时间 格式：yyyy-MM-dd HH:MM:SS
 */
function getCurrentTime() {
  const date = new Date(); //当前时间
  const month = zeroFill(date.getMonth() + 1); //月
  const day = zeroFill(date.getDate()); //日
  const hour = zeroFill(date.getHours()); //时
  const minute = zeroFill(date.getMinutes()); //分
  const second = zeroFill(date.getSeconds()); //秒

  //当前时间
  const curTime =
    date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

  return curTime;
}

/**
 * 补零
 */
function zeroFill(i) {
  if (i >= 0 && i <= 9) {
    return '0' + i;
  } else {
    return i;
  }
}
