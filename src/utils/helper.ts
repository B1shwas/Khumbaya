 type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";
 export const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    if (pwd.length === 0) return "weak";
    if (pwd.length < 6) return "weak";
    if (pwd.length < 10) return "medium";
    if (pwd.length < 14) return "strong";
    return "very-strong";
  };