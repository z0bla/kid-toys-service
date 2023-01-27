import Joi from "joi";

const userSchema = Joi.object({
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

export default userSchema;
