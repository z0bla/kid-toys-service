import { NextFunction, Request, Response } from "express";
import { userSchema } from "../models/user.model";
import { STATUS_CODES } from "../utils/constants";
import logger from "../utils/logger";

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    logger.error("Validation error: " + errorMessage);

    res.status(STATUS_CODES.BAD_REQUEST).json({
      status: "error",
      message: errorMessage
    });

    return;
  }

  next();
}
