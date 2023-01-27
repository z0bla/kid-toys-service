import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().max(45),
  lastName: Joi.string().max(45),
  phoneNumber: Joi.number(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/
    )
    .required(),
});

export default userSchema;
