type UserSignupType = {
  name: string;
  email: string;
  password: string;
};
type UserLoginType = {
  email: string;
  password: string;
};
export { UserLoginType, UserSignupType };
