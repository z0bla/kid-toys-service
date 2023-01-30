import Joi from "joi";

export const userSchema = Joi.object({
  firstName: Joi.string().max(45),
  lastName: Joi.string().max(45),
  phoneNumber: Joi.number(),
  address: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/
    )
    .required(),
  role: Joi.string(),
});

export interface User {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: number | null;
  address?: string | null;
  email: string;
  password: string;
  role: Role;
}

enum Role {
  admin = "ADMIN",
  user = "USER",
}
