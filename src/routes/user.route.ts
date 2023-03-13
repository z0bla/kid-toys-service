import { Request, Response, Router } from "express";
import { validate } from "../middleware/schemaValidation";

import { User } from "../models/user.model";

import { sendConfirmationEmail } from "../services/email.service";
import {
  createUser,
  generateAccessToken,
  getUserByEmail,
  isPasswordValid,
} from "../services/user.service";

import { STATUS_CODES } from "../utils/constants";
import { UserAlreadyExistsException } from "../utils/exceptions";
import logger from "../utils/logger";

const router = Router();

router.post("/register", validate, async (req: Request, res: Response) => {
  try {
    const existingUser = await getUserByEmail(req.body.email);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const user = await createUser(req.body);

    logger.info("User created: " + user.id);
    sendConfirmationEmail(user.email);
    res.status(STATUS_CODES.CREATED).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsException) {
      logger.error("Error: " + error.message);
      res.status(STATUS_CODES.CONFLICT).json({
        status: "error",
        message: error.message,
      });
      return;
    }

    logger.error("Internal server error");
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  const isValidPassword = await isPasswordValid(user as User, password);

  if (!user || !isValidPassword) {
    return res.status(STATUS_CODES.UNAUTHORIZED).send("Unauthorized");
  }

  const token = generateAccessToken({ id: user.id, role: user.role });

  res.status(STATUS_CODES.OK).json({ token }).end();
});

export default router;
