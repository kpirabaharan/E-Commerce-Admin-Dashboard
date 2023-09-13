import nodemailer from 'nodemailer';

export interface sendEmailConfig {
  toEmail: string;
  subject: string;
  body: string;
}

export const sendEmail = ({ toEmail, subject, body }: sendEmailConfig) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_SECRET,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Sent: ' + info.response);
    }
  });
};
