const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return null;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
};

export const withOpacity = (color: string, opacity: number) => {
  if (color.startsWith("#")) {
    const rgb = hexToRgb(color);
    if (!rgb) {
      return color;
    }
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }

  if (color.startsWith("rgb")) {
    return color.replace(/rgba?\(([^)]+)\)/, (_match, value) => {
      const [r, g, b] = value.split(",").map((v: string) => v.trim());
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    });
  }

  return color;
};
