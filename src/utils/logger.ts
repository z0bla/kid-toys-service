require("dotenv").config();
const winston = require("winston");
const { combine, timestamp, json, errors } = winston.format;
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

const destinations =
  process.env.NODE_ENV === "production"
    ? [new winston.transports.Console(), new LogtailTransport(logtail)]
    : [new winston.transports.Console()];

export default winston.createLogger({
  level: process.env.WINSTON_LOG_LEVEL || "info",
  // optional: if we use same Logtail for both frontend and backend
  defaultMeta: {
    service: "kid-toys-service",
  },
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: destinations,
  exceptionHandlers: destinations,
  rejectionHandlers: destinations,
});
