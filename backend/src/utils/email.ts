import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

export class Email {
  private to: string;
  private name: string;
  private url: string;
  private from: string;

  constructor(user: any, url: string) {
    this.to = user.email;
    this.name = user.name.split(" ")[0];
    this.url = url;
    this.from = `Your App <${process.env.EMAIL_FROM}>`;
  }

  private newTransport() {
    console.log(
      "CHECKING ENVS:",
      process.env.EMAIL_USERNAME,
      process.env.EMAIL_HOST
    );
    // PRODUCTION LOGIC
    // if (process.env.NODE_ENV === "production") {
    //   // Cast the object to SMTPTransport.Options
    //   return nodemailer.createTransport({
    //     host: process.env.PROD_EMAIL_HOST,
    //     port: Number(process.env.PROD_EMAIL_PORT),
    //     auth: {
    //       user: process.env.PROD_EMAIL_USERNAME,
    //       password: process.env.PROD_EMAIL_PASSWORD,
    //     },
    //   } as SMTPTransport.Options);
    // }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as SMTPTransport.Options);
  }

  // Send the actual email
  async send(subject: string, message: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send(
      "Your password reset token (valid for only 10 minutes)",
      `Hi ${this.name},\nForgot your password? Submit a PATCH request with your new password to: ${this.url}.\n\nIf you didn't forget your password, please ignore this email!`
    );
  }
}
