type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";
export const calculatePasswordStrength = (pwd: string): PasswordStrength => {
  if (pwd.length === 0) return "weak";
  if (pwd.length < 6) return "weak";
  if (pwd.length < 10) return "medium";
  if (pwd.length < 14) return "strong";
  return "very-strong";
};

export const formatDate = (dateValue?: string) => {
  if (!dateValue) return "—";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateValue?: string, fallbackTime?: string | null) => {
  if (fallbackTime) return fallbackTime;
  if (!dateValue) return "TBD";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "TBD";

  return parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};