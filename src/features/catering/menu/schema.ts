import { z } from "zod";

export const createMenuSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description must be less than 255 characters"),
  type: z
    .string()
    .min(1, "Type is required")
    .max(255, "Type must be less than 255 characters"),
  menuType: z
    .string()
    .min(1, "Menu type is required")
    .max(255, "Menu type must be less than 255 characters"),
});

export const updateMenuSchema = z.object({
  name: z.string().max(255, "Name must be less than 255 characters").optional(),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .optional(),
  type: z.string().max(255, "Type must be less than 255 characters").optional(),
  menuType: z
    .string()
    .max(255, "Menu type must be less than 255 characters")
    .optional(),
});

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
