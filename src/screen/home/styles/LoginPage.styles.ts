import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#BE3A3A",
    marginTop: 16,
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Regular",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: "#333",
    fontFamily: "PlusJakartaSans-Regular",
  },
  passwordToggle: {
    paddingHorizontal: 16,
  },
  loginButton: {
    backgroundColor: "#BE3A3A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSans-Bold",
  },
  forgotPassword: {
    marginTop: 16,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#BE3A3A",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 48,
  },
  signupText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
  },
  signupLink: {
    color: "#BE3A3A",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSans-Bold",
  },
});
