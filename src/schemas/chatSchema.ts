import { z } from "zod";

const groupNameSchema = z
  .string()
  .min(3, {
    message: "Group Name must be at least 3 characters long",
  })
  .max(50, {
    message: "Group Name must be at most 50 characters long",
  });

const groupDescriptionSchema = z
  .string()
  .max(500, {
    message: "Group Description must be at most 500 characters long",
  })
  .optional();

export { groupNameSchema, groupDescriptionSchema };
