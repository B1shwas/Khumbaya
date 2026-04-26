import { z } from "zod";

export const cateringFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Catering plan name is required")
      .max(255, "Name must be 255 characters or less"),
    per_plate_price: z
      .string()
      .min(1, "Per plate price is required")
      .refine(
        (val) => /^\d+(\.\d{1,2})?$/.test(val),
        "Per plate price must be a valid decimal (e.g., 50 or 50.99)"
      ),
    startDateTime: z
      .string()
      .min(1, "Start date and time is required")
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Invalid start date format")
      .refine((val) => {
        const date = new Date(val);
        const now = new Date();
        return date > now;
      }, "Start date must be in the future"),
    endDateTime: z
      .string()
      .min(1, "End date and time is required")
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Invalid end date format"),
    meal_type: z
      .string()
      .min(1, "Meal type is required")
      .max(255, "Meal type must be 255 characters or less"),
    vendorId: z.number().optional().nullable(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDateTime);
      const endDate = new Date(data.endDateTime);
      return endDate > startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDateTime"],
    }
  );

export type CateringFormData = z.infer<typeof cateringFormSchema>;
