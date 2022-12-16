import express from "express";
import prisma from "./prisma";

const app = express();
const port = "5000";

async function connectDb() {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (err) {
    console.log("Error connectig to database: ", err);
  }
}

connectDb();

app.get("/", (req, res) => {
  prisma.user
    .create({
      data: {
        firstName: "D",
        lastName: "Blazanovic",
      },
    })
    .then(() => {
      res.end("user created");
    })
    .catch((err) => {
      res.end(`Error: ${err}`);
    });
});

app.get("/delete", async (req, res) => {
  await prisma.user.deleteMany({});
  res.end("All records deleted");
});

app.listen(port, () => {
  console.log("Server is listening...");
});
