import { Router, Request, Response } from "express";
import userSchema from "../models/user.model";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import logger from "../utils/logger";
import { UserAlreadyExistsException } from "../utils/exceptions";

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

    const existingUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
      },
    });
    logger.info("User created: " + user);
    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsException) {
      res.status(409).json(error);
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
