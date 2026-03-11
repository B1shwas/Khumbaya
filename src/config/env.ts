export const EXPO_PUBLIC_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || "";
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || "";

export const TEMPTOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJzYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJmYW1pbHlJZCI6bnVsbCwiaWF0IjoxNzczMjE0MzU4LCJleHAiOjE3NzU4MDYzNTh9.-chqDR64VjSpw2fSS9Tw5rphT90ozkRiWNPQJatnA2g";
export const DEBUG_AUTO_LOGIN = __DEV__ && true;

export const TEST_USER = {
  token: TEMPTOKEN, // have the token of the user from the backend wala token
  user: {
    id: "1",
    email: "sam@gmail.com",
    username: "sam",
  },
};
