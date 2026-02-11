# Khumbaya Wedding Planning App - Optimization & Scalability Guide

This guide provides best practices for keeping your React Native app optimized, performant, and maintainable as it grows.

---

## 1. Code Splitting & Lazy Loading

### Dynamic Imports
```typescript
// Instead of static imports
import HomeScreen from './screens/Home';

// Use dynamic imports with React.lazy
const HomeScreen = lazy(() => import('./screens/Home'));

// In your router (Expo Router supports this automatically)
```

### Route-based Code Splitting
Expo Router automatically code-splits by route. Keep routes granular:
```
app/
├── (onboarding)/          # Auth flows
├── (protected)/           # Main app
│   ├── (client-tabs)/     # Client features
│   │   ├── home.tsx
│   │   ├── events/
│   │   │   ├── index.tsx
│   │   │   ├── [eventId].tsx
│   │   │   └── timeline.tsx
│   │   └── profile.tsx
│   └── (vendor-tabs)/     # Vendor features
└── _layout.tsx
```

---

## 2. Component Optimization

### Use React.memo for Pure Components
```typescript
// Wrap components that don't need re-renders
const VendorCard = React.memo(({ vendor }: { vendor: Vendor }) => {
  return <View>...</View>;
}, (prev, next) => {
  return prev.vendor.id === next.vendor.id;
});
```

### Use useCallback & useMemo
```typescript
// Memoize callbacks
const handleEventPress = useCallback((eventId: string) => {
  router.push({ pathname: '/events/[eventId]', params: { eventId } });
}, []);

// Memoize expensive computations
const filteredEvents = useMemo(() => {
  return events.filter(e => e.date >= filterDate);
}, [events, filterDate]);
```

### Virtual Lists for Long Lists
```typescript
// Use FlatList instead of mapping
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={item => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

---

## 3. Image Optimization

### Use Appropriate Sizes
```typescript
// Don't load full-res images for thumbnails
<Image
  source={{ uri: 'image.jpg', width: 200, height: 200 }}
  resizeMode="cover"
/>
```

### Use react-native-fast-image
```bash
npm install react-native-fast-image
```
```typescript
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 100, height: 100 }}
  priority={FastImage.priority.high}
/>
```

### Image Caching Strategy
```typescript
// Configure cache duration
FastImage.cacheControl = FastImage.cacheControl.web;

FastImage.cacheControl.immutableWithHeaderRetry = {
  maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
};
```

---

## 4. State Management

### Use Context Wisely
```typescript
// Split contexts by domain
const AuthContext = createContext<AuthState>(initialState);
const EventContext = createContext<EventState>(initialState);
const UIContext = createContext<UIState>(initialState);

// Don't put everything in one context!
```

### Consider State Libraries for Complex Apps
- **Zustand**: Lightweight, simple API
- **Jotai**: Atomic state, great for React Native
- **Redux Toolkit**: If you need Redux dev tools

```typescript
// Example with Zustand
import { create } from 'zustand';

interface EventStore {
  events: Event[];
  selectedEvent: Event | null;
  setEvents: (events: Event[]) => void;
  selectEvent: (event: Event | null) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  selectedEvent: null,
  setEvents: (events) => set({ events }),
  selectEvent: (event) => set({ selectedEvent: event }),
}));
```

---

## 5. Bundle Size Reduction

### Tree Shaking
```typescript
// DO: Import only what you need
import { Button, Card } from '@/components/ui';

// DON'T: Import entire libraries
import * as UI from '@/components/ui';
```

### Remove Unused Dependencies
Regularly check for unused packages:
```bash
# Use depcheck tool
npm install -g depcheck
depcheck
```

### Use Lighter Alternatives
| Heavy Package | Lighter Alternative |
|--------------|---------------------|
| moment.js | date-fns, dayjs |
| lodash | Native JS methods |
| axios | fetch or ky |
| react-native-vector-icons | @expo/vector-icons |

### Configure Metro Bundler
```javascript
// metro.config.js
module.exports = {
  serializer: {
    getModulesPaths: () => [],
    getRunModulePath: () => '',
  },
};
```

---

## 6. Performance Monitoring

### Use React DevTools Profiler
```typescript
import { Profiler, ProfilerOnRenderCallback } from 'react';

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  // Log slow components
  if (actualDuration > 16) {
    console.warn(`${id} took ${actualDuration}ms`);
  }
};

<Profiler id="EventList" onRender={onRender}>
  <EventList />
</Profiler>
```

### Enable Performance Monitoring in Production
```typescript
// In App.tsx
if (__DEV__) {
  import('./utils/perfMonitor');
}
```

### Use Flipper for Debugging
```bash
npx react-native flipper
```

---

## 7. Memory Management

### Avoid Memory Leaks
```typescript
// Always clean up subscriptions
useEffect(() => {
  const subscription = eventEmitter.subscribe(handleEvent);
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### Use WeakRef for Caches
```typescript
const cache = new Map<string, WeakRef<Image>>();

function getCachedImage(key: string): Image | undefined {
  const ref = cache.get(key);
  return ref?.deref();
}
```

### Clean Up Animations
```typescript
useEffect(() => {
  const animation = Animated.timing(value, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  });
  
  return () => animation.stop();
}, [value]);
```

---

## 8. Network Optimization

### Request Batching
```typescript
// Batch multiple requests
const batchRequests = async () => {
  const [events, vendors, guests] = await Promise.all([
    api.getEvents(),
    api.getVendors(),
    api.getGuests(),
  ]);
  return { events, vendors, guests };
};
```

### Pagination for Lists
```typescript
const fetchEvents = async (page: number) => {
  const response = await api.getEvents({ page, limit: 20 });
  return response.data;
};
```

### Offline Support
```typescript
// Use React Query for caching & offline support
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['events'],
  queryFn: fetchEvents,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 9. File Structure Best Practices

### Organized by Feature
```
src/
├── features/              # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── events/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── vendors/
├── components/            # Shared components
├── hooks/                 # Shared hooks
├── services/              # API services
├── utils/                 # Utilities
├── constants/             # Constants
├── types/                 # Global types
└── store/                 # State stores
```

### Component Organization
```
components/
├── ui/                    # Primitive components
│   ├── Button.tsx
│   ├── Text.tsx
│   ├── Input.tsx
│   └── index.ts
├── event/
│   ├── EventCard.tsx
│   ├── TimelineItem.tsx
│   └── index.ts
└── user/
    ├── ProfileHeader.tsx
    └── GuestList.tsx
```

---

## 10. Testing Strategy

### Unit Tests with Jest
```typescript
// __tests__/utils.test.ts
import { formatDate } from '../utils/dateUtils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    expect(formatDate('2024-10-24')).toBe('Oct 24, 2024');
  });
});
```

### Component Tests with Testing Library
```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';

describe('EventCard', () => {
  it('renders event details', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Wedding')).toBeTruthy();
  });
});
```

### E2E Tests with Detox
```typescript
describe('Events', () => {
  beforeEach(async () => {
    await reloadReactNative();
  });
  
  it('should show events list', async () => {
    await expect(element(by.id('events-list'))).toBeVisible();
  });
});
```

---

## 11. CI/CD Optimization

### Fastlane for Builds
```ruby
# Fastfile
lane :build do
  increment_build_number(xcodeproj: 'ios/Khumbaya.xcodeproj')
  build_ios_app(workspace: 'ios/Khumbaya.xcworkspace')
end
```

### GitHub Actions Workflow
```yaml
name: Build
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Build iOS
        run: npm run build:ios
```

---

## 12. Monitoring & Analytics

### Error Tracking with Sentry
```typescript
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_DSN',
  enableInExpoDevelopment: true,
});

export default function App() {
  return (
    <Sentry.Native.ErrorBoundary>
      <Navigation />
    </Sentry.Native.ErrorBoundary>
  );
}
```

### Performance Monitoring
```typescript
// Track custom metrics
import { mixpanel } from '@/utils/mixpanel';

mixpanel.track('Event Created', {
  eventType: 'wedding',
  guestCount: 150,
});
```

---

## 13. Accessibility (a11y)

### Use Semantic Components
```typescript
// DO: Use Pressable with accessibility
<Pressable
  accessibilityRole="button"
  accessibilityLabel="