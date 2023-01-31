import { Request, Response, Router } from "express";

import { userSchema } from "../models/user.model";
import { createUser, getUserByEmail } from "../services/user.service";
import { UserAlreadyExistsException } from "../utils/exceptions";
import logger from "../utils/logger";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      logger.error("Validation error: " + error.details[0].message);
      res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
      return;
    }

    const existingUser = await getUserByEmail(req.body.email);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const user = await createUser(req.body);

    logger.info("User created: " + user);
    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsException) {
      res.status(409);
      logger.error(error);
      return;
    }

    logger.error("Internal server error");
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export default router;
