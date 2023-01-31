import connectDb from "./domains/connectDB";
import app from "./server";
import logger from "./utils/logger";
import prisma from "./utils/prisma";

const port = "5000";

connectDb();

app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    logger.info(users);
    res.json(users).end();
  } catch (error) {
    logger.error(error);
    res.end("Error occurred: " + error);
  }
});

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
