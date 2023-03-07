import logger from "../utils/logger";

require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendConfirmationEmail(email: string): void {
  const message = {
    to: email,
    from: process.env.SENDGRID_FROM_ADDRESS,
    subject: "Kid Toys account created",
    text: "Thank you for creating an account at Kid Toys.",
  };

  sgMail
    .send(message)
    .then(() => {
      logger.info("Email sent successfully");
    })
    .catch((error: any) => {
      logger.error(error);
    });
}
