import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import auth from '@react-native-firebase/auth'; // Import Firebase Auth

const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Basic Validation
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // 2. Sign In with Firebase
      await auth().signInWithEmailAndPassword(email, password);
      
      // 3. Navigate to Main App (Reset stack so they can't go back to login)
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });

    } catch (error: any) {
      console.log(error);
      let errorMessage = "Invalid email or password";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No user found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "That email address is invalid.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerBox}>
          {/* Title */}
          <Text style={styles.title}>
            Sign in with your email
          </Text>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Your Password"
              placeholderTextColor="#777"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
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

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.signUpButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpText}>Login</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          {/* Bottom link */}
          <View style={styles.bottomRow}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  centerBox: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  passwordContainer: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FAFAFA",
  },
  passwordInput: {
    flex: 1,
    color: "#333",
  },
  signUpButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF5733",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF5733",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 20,
    color: "#aaa",
  },
  bottomRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  signUpLink: {
    color: "#FF5733",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default SignInScreen;