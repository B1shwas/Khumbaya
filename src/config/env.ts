export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://events.khumbaya.com/api";
 export const TEMPTOKEN = process.env.TEMPTOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJsYW1pY2hhbmVAZ21haWwuY29tIiwiaWF0IjoxNzE2MTcwNjMsImV4cCI6MTc3MjIyMTg2M30.F6gK1c8ovSju3dqVFytnhVmxWHf2Q704MRGbQun9h98";

export const DEBUG_AUTO_LOGIN = __DEV__ && true;

export const TEST_USER = {
  token: TEMPTOKEN, // have the token of the user from the backend wala token 
  user: {
    id: "1",
    email: "lamichhane@gmail.com",
    username: "Aaditya lamichhane",
  },
};