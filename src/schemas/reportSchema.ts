import { z } from "zod";

const titleSchema = z
  .string()
  .min(2, {
    message: "Title must be at least 2 characters long",
  })
  .max(50, {
    message: "Title must be at most 50 characters long",
  });

const descriptionSchema = z
  .string()
  .min(2, { message: "Description must be at least 2 characters long" })
  .max(500, { message: "Description must be at most 500 characters long" });

export { titleSchema, descriptionSchema };
