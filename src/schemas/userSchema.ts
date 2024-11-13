import { z } from "zod";

const usernameSchema = z
  .string()
  .regex(/^[a-z_1-9.]+$/, {
    message: "Username can only contain letters, numbers, and symbols _ & .",
  })
  .min(2, {
    message: "Username must be more than 2 characters",
  })
  .max(20, {
    message: "Username must be less than 20 characters",
  })
  .trim()
  .refine((value) => !value.startsWith("."), {
    message: "Username cannot start with .",
  })
  .refine((value) => !/^\d/.test(value), {
    message: "Username cannot start with a number",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Username must contain at least one letter",
  });

const emailSchema = z
  .string()
  .email()
  .min(6, {
    message: "Email must be more than 6 characters",
  })
  .max(50, {
    message: "Email must be less than 50 characters",
  })
  .trim();

const passwordSchema = z
  .string()
  .min(6, {
    message: "Password must be more than 6 characters",
  })
  .max(50, {
    message: "Password must be less than 50 characters",
  });

const fullNameSchema = z
  .string()
  .min(2, {
    message: "Name must be more than 2 characters",
  })
  .max(20, {
    message: "Name must be less than 20 characters",
  });

const verificationCodeSchema = z.coerce
  .number({
    message: "Invalid verification code",
  })
  .min(100000, {
    message: "Invalid verification code",
  })
  .max(999999, {
    message: "Invalid verification code",
  });

const bioSchema = z.string().max(160, {
  message: "Bio must be less than 160 characters",
});

export {
  bioSchema,
  emailSchema,
  usernameSchema,
  passwordSchema,
  fullNameSchema,
  verificationCodeSchema,
};
