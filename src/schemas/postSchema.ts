import { z } from "zod";

const captionSchema = z
  .string()
  .max(1000, {
    message: "Caption should not exceed 1000 characters",
  })
  .optional();

export { captionSchema };
