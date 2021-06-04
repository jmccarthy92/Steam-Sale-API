import * as NodeMailer from 'nodemailer';

interface MailConfiguration {
    to: string | string[];
    cc?: string[];
    bcc?: string[];
    from: string;
    subject: string;
    text?: string;
    html?: string;
}

export default class Mailer {
    private static transporter: any;

    public static async sendEmails(mailConfig: MailConfiguration): Promise<boolean> {
        Mailer.setUp();
        await new Promise((resolve, reject): void => {
            Mailer.transporter.sendMail(mailConfig, (err: Error, info: any): void => {
                if (err) {
                    console.error(err);
                    reject(err.message);
                }
                console.info(info);
                resolve(info);
            });
        });
        return true;
    }

    private static setUp(){
        Mailer.transporter = NodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
              user: process.env.MAIL_EMAIL,
              pass:  process.env.MAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }
}