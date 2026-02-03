# Custom Fonts Setup

## How to Add Custom Fonts

### 1. Get Your Font Files

Download your custom font files (.ttf, .otf) and place them in the `assets/fonts/` directory.

For example, if you want to use **Inter** or **Poppins** from Google Fonts:

- Go to https://fonts.google.com/
- Select your font (e.g., "Inter" or "Poppins")
- Download the font family
- Extract and copy the `.ttf` files to `assets/fonts/`

Example structure:

```
assets/fonts/
  ├── Inter-Regular.ttf
  ├── Inter-Medium.ttf
  ├── Inter-SemiBold.ttf
  ├── Inter-Bold.ttf
  ├── Poppins-Regular.ttf
  └── Poppins-Bold.ttf
```

### 2. Load Fonts in \_layout.tsx

Update `app/_layout.tsx` to load your fonts:

```tsx
const [fontsLoaded] = useFonts({
  "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
  "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
});
```

### 3. Configure Tailwind

Update `tailwind.config.js` to use your custom fonts:

```javascript
fontFamily: {
  sans: ['Inter-Regular', 'system-ui', 'sans-serif'],
  display: ['Poppins-Bold', 'Inter-Bold', 'sans-serif'],
  mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
  // Add custom font families
  inter: ['Inter-Regular', 'system-ui', 'sans-serif'],
  poppins: ['Poppins-Regular', 'system-ui', 'sans-serif'],
},
```

### 4. Use in Components

Apply fonts using Tailwind classes:

```tsx
<Text className="font-sans">Regular text with Inter</Text>
<Text className="font-display">Display text with Poppins</Text>
<Text className="font-poppins">Custom Poppins text</Text>
<Text className="font-inter">Custom Inter text</Text>
```

### Font Weights in React Native

To use different font weights, you need to load each weight separately:

```tsx
// In _layout.tsx
const [fontsLoaded] = useFonts({
  "Inter-Light": require("../assets/fonts/Inter-Light.ttf"), // 300
  "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"), // 400
  "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"), // 500
  "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"), // 600
  "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"), // 700
});
```

Then use them:

```tsx
<Text style={{ fontFamily: 'Inter-Regular' }}>Normal</Text>
<Text style={{ fontFamily: 'Inter-Medium' }}>Medium</Text>
<Text style={{ fontFamily: 'Inter-Bold' }}>Bold</Text>
```

## Recommended Font Pairings

### Option 1: Inter (Clean & Modern)

- **Headings**: Inter Bold/SemiBold
- **Body**: Inter Regular
- Download: https://fonts.google.com/specimen/Inter

### Option 2: Poppins (Playful & Geometric)

- **Headings**: Poppins Bold/SemiBold
- **Body**: Poppins Regular
- Download: https://fonts.google.com/specimen/Poppins

### Option 3: Montserrat + Open Sans

- **Headings**: Montserrat Bold
- **Body**: Open Sans Regular
- Download:
  - https://fonts.google.com/specimen/Montserrat
  - https://fonts.google.com/specimen/Open+Sans

### Option 4: Playfair Display + Source Sans

- **Headings**: Playfair Display Bold (elegant)
- **Body**: Source Sans Regular
- Download:
  - https://fonts.google.com/specimen/Playfair+Display
  - https://fonts.google.com/specimen/Source+Sans+3

## Current Setup

The app currently uses system fonts. To add custom fonts, follow the steps above.
