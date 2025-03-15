import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const mailerService = {
  notifySubscribers: async (subscribers, subject, text) => {
    console.log(subscribers);
    const RESULTS = await Promise.all(
      subscribers.map(async (subscriber) => {
        const MAIL_INFO = await transporter.sendMail({
          from: user,
          to: subscriber.email,
          subject: subject,
          text: text,
        });
        return MAIL_INFO.accepted;
      })
    );
    return RESULTS.flat();
  },
};

export default mailerService;