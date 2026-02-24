export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://events.khumbaya.com/api";
export const TEMPTOKEN =
  process.env.TEMPTOKEN ||
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzZXIiLCJlbWFpbCI6ImxhbWljaGhhbmVAZ21haWwuY29tIiwiaWF0IjoxNzcxODI0MzU0LCJleHAiOjE3NzQ0MTYzNTR9.f_NQJATZ6iJJxImro95CrH_YM0B0bHxBL38-3sqfKI4";
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