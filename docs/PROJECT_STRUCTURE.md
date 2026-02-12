# Project Structure

This document captures the current layout of the repository as of February 12, 2026. It’s meant to be a quick map of where things live and what they're for.

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
docs/
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
- `docs/` — Documentation files.

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
    (usersignup)/
      _layout.tsx
      index.tsx
    (vendorsignup)/
      _layout.tsx
      index.tsx
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
        card-making.tsx
        create.tsx
        event-estimates.tsx
        event-location.tsx
        gallery.tsx
        guests.tsx
        index.tsx
        rsvp.tsx
        subevent-create.tsx
        subevent-detail.tsx
        success.tsx
        table-management.tsx
        timeline.tsx
        vendors.tsx
        # Refactored with modular structure:
        hooks/
          useRSVPPage.ts
          useSuccess.ts
          useVendors.ts
        components/
          EventCard.tsx
          QuestionCard.tsx
          SubEventCard.tsx
          DecisionView.tsx
          QuestionsView.tsx
          ConfirmationView.tsx
          StepIndicator.tsx
          VendorCard.tsx
          styles/
            RSVP.styles.ts
        types/
          rsvp.ts
    (vendor-tabs)/
      _layout.tsx
      calendar.tsx
      events/
        _layout.tsx
        [eventId].tsx
        index.tsx
      home.tsx
      profile.tsx
```

### Notes

- This is file-based routing using Expo Router.
- Route groups like `(onboarding)` and `(protected)` organize navigation segments.
- Dynamic routes like `[eventId].tsx` handle event-specific screens.
- Refactored pages follow a modular pattern with hooks/, components/, types/, and styles/ subdirectories.

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
      SubEventTemplateCard.tsx
    ui/
      Button.tsx
      Text.tsx
      event/
        EventVendor.tsx
      user/
        Invitation.tsx
      usersignup/
        Complete.tsx
        Letstart.tsx
        Personalize.tsx
        index.tsx
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
  features/
    guests/
      constants.ts
      types.ts
      utils.ts
      hooks/
        useGuests.ts
      components/
        AddGuestModal.tsx
        CategoryPills.tsx
        FilterSidebar.tsx
        GuestCard.tsx
        index.ts
        QuickActions.tsx
        SearchBar.tsx
        SegmentedControl.tsx
        StatsRow.tsx
    home/
      types.ts
      hooks/
        useHomeData.ts
      components/
        ArticleCard.tsx
        CoupleCard.tsx
        EventCard.tsx
        HotelCard.tsx
        QuickServiceButton.tsx
        VendorCard.tsx
        VenueCard.tsx
  screen/
    home/
      explorevendors.tsx
      HomePage.tsx
      LoginPage.tsx
      # Refactored modular structure:
      hooks/
        useLogin.ts
      styles/
        LoginPage.styles.ts
        explorevendors.styles.ts
      types/
        login.ts
        explorevendors.ts
    user/
      View/
        Budget.tsx
        EventDetail.tsx
        Events.tsx
        Explore.tsx
        GuestList.tsx
        Home.tsx
        Profile.tsx
        Timeline.tsx
        index.ts
        # Refactored modular structure:
        hooks/
          useEvents.ts
          useBudget.ts
          useTimeline.ts
        styles/
          Events.styles.ts
          Budget.styles.ts
          Timeline.styles.ts
        types/
          events.ts
        components/
          EventCard.tsx
          SubEventCard.tsx
      cms/
        CardMaking.tsx
        EventComponents.tsx
        EventCreate.tsx
        EventEstimates.tsx
        EventLocation.tsx
        EventSuccess.tsx
        SubEventCreate.tsx
        SubEventDetail.tsx
        TableManagement.tsx
        index.ts
        # Refactored modular structure:
        hooks/
          useCardMaking.ts
          useEventEstimates.ts
          useEventLocation.ts
          useSubEventCreate.ts
        styles/
          CardMaking.styles.ts
          EventEstimates.styles.ts
          EventLocation.ststyles.ts
          SubEventCreate.styles.ts
        types/
          cardMaking.ts
          eventEstimates.ts
          eventLocation.ts
          subEventCreate.ts
        components/
          InfoSection.tsx
          CardItem.tsx
          EmptyState.tsx
          AddCardModal.tsx
          ImagePickerModal.tsx
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
      # Styles:
      vendorhome-style.ts
  store/
    AuthContext.tsx
  styles/
    vendorhome-style.ts
  utils/
    cn.ts
    helper.ts
```

### Notes

- `components/` contains reusable UI and feature components.
- `constants/` stores static data and configuration.
- `screen/` includes screen implementations not directly tied to Expo Router routes (likely composed by route files).
- `features/` contains domain-specific modules with hooks, types, and components (e.g., guests, home).
- **Refactoring Pattern**: Screens follow a modular structure:
  - `hooks/` - Custom React hooks for business logic
  - `types/` - TypeScript interfaces and types
  - `styles/` - StyleSheet objects
  - `components/` - Reusable UI components

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

## `docs/`

```
docs/
  PROJECT_STRUCTURE.md
  APP_OPTIMIZATION_GUIDE.md
```

Documentation files.

---

## Refactoring Summary

The following files have been refactored to follow the single responsibility principle:

| File                | Original Lines | Refactored Lines |
| ------------------- | -------------- | ---------------- |
| SubEventDetail.tsx  | 1963           | ~120             |
| TableManagement.tsx | 1429           | ~200             |
| rsvp.tsx            | 1123           | ~80              |
| CardMaking.tsx      | 811            | ~100             |
| EventSuccess.tsx    | 698            | ~120             |
| Events.tsx          | 849            | ~100             |
| vendors.tsx         | 539            | ~85              |
| EventCreate.tsx     | 637            | ~100             |
| Budget.tsx          | 574            | ~100             |
| Timeline.tsx        | 559            | ~120             |
| EventEstimates.tsx  | 523            | ~120             |
| EventLocation.tsx   | 467            | ~130             |
| SubEventCreate.tsx  | 448            | ~150             |
| LoginPage.tsx       | 214            | ~100             |

If you want this structure auto-updated, we can wire a small script to regenerate it when folders change.
