import logger from "../utils/logger";

require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendConfirmationEmail(email: string) {
  const message = {
    to: email,
    from: process.env.SENDGRID_FROM_ADDRESS,
    subject: "Kid Toys account created",
    text: "Thank you for creating an account at Kid Toys.",
  };

  sgMail
    .send(message)
    .then((response: any) => {
      logger.info(response[0].statusCode);
      logger.info(response[0].headers);
    })
    .catch((error: any) => {
      logger.error(error);
    });
}
