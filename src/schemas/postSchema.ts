import { z } from "zod";

const captionSchema = z
  .string()
  .max(1000, {
    message: "Caption should not exceed 1000 characters",
  })
  .optional();

const commentSchema = z
  .string()
  .min(1, {
    message: "Comment cannot be empty",
  })
  .max(1000, {
    message: "Comment cannot be more than 1000 characters",
  });

export { captionSchema, commentSchema };
