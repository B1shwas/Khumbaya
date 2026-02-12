export interface EstimatesFormData {
  guestCount: string;
  budget: string;
  currency: string;
  isBudgetPrivate: boolean;
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "NPR", symbol: "Rs", name: "Nepalese Rupee" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];
