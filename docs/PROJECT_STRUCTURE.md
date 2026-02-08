# Project Structure

This document captures the current layout of the repository as of February 7, 2026. It’s meant to be a quick map of where things live and what they’re for.

## Top-level

```
app.json
babel.config.js
eslint.config.js
expo-env.d.ts
metro.config.js
nativewind-env.d.ts
package.json
pnpm-lock.yaml
README.md
tailwind.config.js
tsconfig.json

app/
assets/
scripts/
src/
store/
styles/
utils/
```

### What these are

- `app.json` — Expo app configuration.
- `babel.config.js` — Babel configuration for the app.
- `eslint.config.js` — ESLint configuration.
- `expo-env.d.ts` — Expo/TypeScript environment typings.
- `metro.config.js` — Metro bundler configuration.
- `nativewind-env.d.ts` — NativeWind typings.
- `package.json` — Dependencies and scripts.
- `pnpm-lock.yaml` — PNPM lockfile.
- `README.md` — Project overview and setup instructions.
- `tailwind.config.js` — Tailwind/NativeWind config.
- `tsconfig.json` — TypeScript configuration.

## `app/` (Expo Router)

```
app/
  _layout.tsx
  global.css
  index.tsx
  (onboarding)/
    _layout.tsx
    explore-vendors.tsx
    index.tsx
    login.tsx
    (vendorsignup)/
      _layout.tsx
      buisnessdetail.tsx
      category.tsx
      contacts.tsx
      index.tsx
      makeofficial.tsx
      review.tsx
      tellus.tsx
  (protected)/
    _layout.tsx
    (client-tabs)/
      _layout.tsx
      explore.tsx
      home.tsx
      profile.tsx
      events/
        _layout.tsx
        [eventId].tsx
        budget.tsx
        gallery.tsx
        guests.tsx
        index.tsx
        timeline.tsx
    (vendor-tabs)/
      _layout.tsx
      calendar.tsx
      events.tsx
      home.tsx
      profile.tsx
      form/
        vendorform.tsx
```

### Notes

- This is file-based routing using Expo Router.
- Route groups like `(onboarding)` and `(protected)` organize navigation segments.
- Dynamic routes like `[eventId].tsx` handle event-specific screens.

## `assets/`

```
assets/
  fonts/
  images/
```

Static assets (fonts and images).

## `scripts/`

```
scripts/
  reset-project.js
```

Utility scripts (reset scaffolding).

## `src/`

```
src/
  components/
    event/
      VendorCard.tsx
    ui/
      Button.tsx
      Text.tsx
      vendorForm/
        BuisnessDetail.tsx
        CategorySelection.tsx
        index.tsx
        MakeOfficial.tsx
        Reviewandactivate.tsx
        TellUs.tsx
        VendorContacts.tsx
    vendor/
      ActionButton.tsx
      EventItem.tsx
      Header.tsx
      PendingRequest.tsx
      Section.tsx
      StatsCard.tsx
  constants/
    vendors.ts
  screen/
    home/
      explorevendors.tsx
      HomePage.tsx
      LoginPage.tsx
    user/
      View/
        Budget.tsx
        EventDetail.tsx
        Events.tsx
        Explore.tsx
        GuestList.tsx
        Home.tsx
        index.ts
        Profile.tsx
        Timeline.tsx
    vendor/
      CategorySelection.tsx
      EventvendorScreen.tsx
      Portfolio.tsx
      Reviewandactivate.tsx
      VendorBuisnessInfo.tsx
      VendorCalnder.tsx
      VendorEventid.tsx
      VendorForm.tsx
      vendorHome.tsx
```

### Notes

- `components/` contains reusable UI and feature components.
- `constants/` stores static data and configuration.
- `screen/` includes screen implementations not directly tied to Expo Router routes (likely composed by route files).

## `store/`

```
store/
  AuthContext.tsx
```

State and context providers (auth context).

## `styles/`

```
styles/
  vendorhome-style.ts
```

Shared styles.

## `utils/`

```
utils/
  cn.ts
  helper.ts
```

Utility helpers.

---

If you want this structure auto-updated, we can wire a small script to regenerate it when folders change.