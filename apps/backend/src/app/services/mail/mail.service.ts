import nodemailer from 'nodemailer';
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";

@Injectable()
export class MailService {
  private transporter;
  constructor(private configService: ConfigService,) {

    console.log('this.configService', this.configService)

    let configOptions = {
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS')
      },
      tls : { rejectUnauthorized: false }
    }

  this.transporter = nodemailer.createTransport(configOptions)
  }
  sendActivationMail(to, link) {
    console.log('to', to)
    console.log('link', link)
    // todo тестируем постманом
    // this.transporter.sendMail({
    //   to,
    //   from: this.configService.get('SMTP_USER'),
    //   subject: `Активация личного кабинета на сайте ${this.configService.get('DOMAIN')}`,
    //   text: '',
    //   html: `<div><h1>Для активации личного кабинета перейдите по ссылке:</h1>
    //           <div style="margin-top: 16px">Ссылка для активации: <a href="${link}" target="_blank">${link}</a> </div>
    //         </div>
    //         `
    // })
  }

}
