import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const SignInScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerBox}>
          {/* Title */}
          <Text style={styles.title}>
            Sign in with your email or phone number
          </Text>

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email or Phone Number"
            placeholderTextColor="#777"
          />

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Your Password"
              placeholderTextColor="#777"
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? "eye" : "eye-off"}
                size={20}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signUpText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          {/* Google */}
          <TouchableOpacity style={styles.socialBtn}>
            <Image
              source={require("../../assets/icons/google-icon.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity style={styles.socialBtn}>
            <Image
              source={require("../../assets/icons/facebook-icon.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Sign in with Facebook</Text>
          </TouchableOpacity>

          {/* Bottom link */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Don’t have an account? </Text>

            <TouchableOpacity>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    flexGrow: 1,
  },

  centerBox: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "center",
    paddingVertical: 40,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginBottom: 25,
    textAlign: "left",
  },

  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  signUpButton: {
    backgroundColor: "#1DB954",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  signUpText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  orText: {
    textAlign: "center",
    marginVertical: 15,
    color: "#666",
    fontSize: 14,
  },

  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    height: 50,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },

  socialIcon: {
    width: 26,
    height: 26,
    marginRight: 10,
  },

  socialText: {
    fontSize: 16,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  bottomText: {
    fontSize: 14,
    color: "#444",
  },

  signUpLink: {
    fontSize: 14,
    color: "#1DB954",
    fontWeight: "600",
  },
});
