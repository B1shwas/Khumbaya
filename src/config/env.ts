export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://events.khumbaya.com/api";
export const TEMPTOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzZXIiLCJlbWFpbCI6ImxhbWljaGhhbmVAZ21haWwuY29tIiwiaWF0IjoxNzcxODY4OTc2LCJleHAiOjE3NzQ0NjA5NzZ9.vmZRszGlIkO2rGYMo1I4W0ifuEwZUxOeEeduLesaDWg";
export const DEBUG_AUTO_LOGIN = __DEV__ && true;

export const TEST_USER = {
  token: TEMPTOKEN, // have the token of the user from the backend wala token
  user: {
    id: "1",
    email: "lamichhane@gmail.com",
    username: "Aaditya lamichhane",
  },
};
//