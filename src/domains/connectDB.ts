import logger from "../utils/logger";
import prisma from "../utils/prisma";

async function connectDb() {
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (error) {
    logger.error("Error connecting to database: ", error);
  }
}

export default connectDb;
