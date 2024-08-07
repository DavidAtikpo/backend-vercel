import joi from "joi";

const userBaseSchema = joi.object({
  firstName: joi
    .string()
    .min(3)
    .max(20)
    .required()
    .pattern(new RegExp(/^[A-Za-z]+$/))
    .messages({
      "string.base": "Must be a string",
      "string.empty": "Cannot be empty",
      "string.min": "Must have at least {#limit} characters",
      "string.max": "Cannot exceed {#limit} characters",
      "string.pattern.base": "Must contain only letters",
      "any.required": "Required field"
    }),
  lastName: joi
    .string()
    .min(3)
    .max(20)
    .required()
    .pattern(new RegExp(/^[A-Za-z]+$/))
    .messages({
      "string.base": " Must be a string",
      "string.empty": "Cannot be empty",
      "string.min": "Must have at least {#limit} characters",
      "string.max": "Cannot exceed {#limit} characters",
      "string.pattern.base": "Must contain only letters",
      "any.required": "Required field"
    }),

  email: joi
    .string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
    .messages({
      "string.email": "Invalid email format.",
      "string.empty": "Field cannot be an empty.",
      "any.required": "Field is a required."
    }),
  phoneNumber: joi
    .string()
    .trim()
    .regex(/^\d{8,15}$/)
    .message("Phone number must contain only digits")
    .min(8)
    .max(15)
    .message(
      "Phone number must be between 10 and 15 digits long (excluding the plus sign)"
    )
    .required()
    .messages({
      "string.base": "Must be a string",
      "string.empty": "Number is required",
      "string.pattern.base": "Must contain only digits",
      "string.min":
        "Must be at least {{#limit}} characters long (excluding the plus sign)",
      "string.max":
        "Must be at most {{#limit}} characters long (excluding the plus sign)",
      "any.required": "Phone number is a required field"
    }),
  role: joi.string().min(3).messages({
    "any.required": "Role cant be left empty"
  })
});

const userWithPasswordSchema = userBaseSchema.keys({
  password: joi
    .string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%&*])/)
    .required()
    .messages({
      "string.pattern.base":
        "Should be a mix of alphabets and numeric characters.",
      "string.min": "Password should have a minimum length of 8.",
      "string.empty": "Field cannot be an empty field.",
      "any.required": "Field is a required field."
    }),
  confirmPassword: joi.string().required().valid(joi.ref("password")).messages({
    "any.only": "Passwords do not match.",
    "string.empty": "Field cannot be an empty field.",
    "any.required": "Field is a required field."
  })
});

const Validator = async (req, res, next) => {
  let error;

  if ("token" in req.headers) {
    ({ error } = userBaseSchema.validate(req.body, { abortEarly: false }));
  } else {
    ({ error } = userWithPasswordSchema.validate(req.body, { abortEarly: false }));
  }

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    const joiErrorMessages = {};

    error.details.forEach((detail) => {
      const key = detail.path.join(".");
      const message = detail.message;
      joiErrorMessages[key] = message;
    });

    return res.status(403).json({ errors: joiErrorMessages });
  }

  next();
};



export default {Validator};
