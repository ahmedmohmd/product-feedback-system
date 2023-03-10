import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "..", "..", "config", ".env") });

const transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 465,
  auth: {
    user: process.env.ELASTIC_EMAIL_USER_NAME,
    pass: process.env.ELASTIC_EMAIL_PASSWORD,
  },
});

const sendMail = ({ from, to, subject, text, html }) => {
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};

export default sendMail;
