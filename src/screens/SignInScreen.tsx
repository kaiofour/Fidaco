import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import auth from '@react-native-firebase/auth';

// --- BMO COLORS ---
const COLORS = {
  BODY: "#639FAB",
  SCREEN_BG: "#D6F8E8",
  SCREEN_BORDER: "#4A7A85", 
  BUTTON_RED: "#FF595E",
  BUTTON_GREEN: "#8AC926",
  DPAD: "#F4D35E",
  TEXT_DARK: "#2A454B"
};

const SignInScreen = ({ navigation }: any) => {
  // 1. HOOKS (Must be at the top)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation Hook
  const eyeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeoutId: any;

    const blink = () => {
      Animated.sequence([
        Animated.timing(eyeScale, {
          toValue: 0.1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(eyeScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start(() => {
        const nextBlink = Math.random() * 4000 + 2000;
        timeoutId = setTimeout(blink, nextBlink);
      });
    };

    blink();

    // Cleanup to prevent memory leaks if you leave the screen
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("BMO Says:", "Please enter your email and password!");
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      console.log(error);
      Alert.alert("Login Failed", "Check your email and password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <View style={styles.bodyContainer}>
          
          {/* --- BMO'S FACE --- */}
          <View style={styles.monitorContainer}>
            <View style={styles.screen}>
              
              {/* FACE */}
              <View style={styles.faceContainer}>
                <View style={styles.eyesRow}>
                  <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeScale }] }]} />
                  <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeScale }] }]} />
                </View>
                <View style={styles.mouth} />
              </View>

              {/* INPUTS */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="adventure@time.ooo"
                  placeholderTextColor="rgba(42, 69, 75, 0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={styles.label}>PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••"
                  placeholderTextColor="rgba(42, 69, 75, 0.5)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
          </View>

          {/* --- CONTROLS --- */}
          <View style={styles.controlsContainer}>
            {/* D-PAD */}
            <View style={styles.dpadContainer}>
              <View style={styles.dpadVertical} />
              <View style={styles.dpadHorizontal} />
              <View style={styles.dpadCenter} />
            </View>

            {/* BUTTONS */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.bigButton, styles.redBtn]} 
                onPress={handleLogin}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>GO</Text>}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.smallButton, styles.greenBtn]} 
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.smallBtnText}>NEW</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SLOTS */}
          <View style={styles.slotsRow}>
             <View style={styles.slot} />
             <View style={styles.slot} />
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BODY },
  bodyContainer: { flex: 1, padding: 20, justifyContent: 'space-between' },
  monitorContainer: { backgroundColor: COLORS.BODY, padding: 15, borderRadius: 20, elevation: 10, marginBottom: 20 },
  screen: { backgroundColor: COLORS.SCREEN_BG, borderRadius: 15, padding: 20, height: 380, borderWidth: 4, borderColor: COLORS.SCREEN_BORDER, justifyContent: 'space-between' },
  
  faceContainer: { alignItems: 'center', marginTop: 20 },
  eyesRow: { flexDirection: 'row', justifyContent: 'space-between', width: 120, marginBottom: 15 },
  eye: { width: 25, height: 25, backgroundColor: COLORS.TEXT_DARK, borderRadius: 12.5 },
  mouth: { width: 60, height: 25, borderBottomWidth: 4, borderColor: COLORS.TEXT_DARK, borderRadius: 30, marginTop: -10 },

  inputGroup: { marginBottom: 10 },
  label: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: COLORS.TEXT_DARK, fontWeight: 'bold', marginBottom: 4, fontSize: 12, letterSpacing: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 2, borderColor: COLORS.TEXT_DARK, borderRadius: 10, paddingHorizontal: 15, height: 50, marginBottom: 15, color: COLORS.TEXT_DARK, fontSize: 16, fontWeight: 'bold' },

  controlsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, height: 150 },
  dpadContainer: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center' },
  dpadVertical: { position: 'absolute', width: 30, height: 90, backgroundColor: COLORS.DPAD, borderRadius: 5, elevation: 4 },
  dpadHorizontal: { position: 'absolute', width: 90, height: 30, backgroundColor: COLORS.DPAD, borderRadius: 5, elevation: 4 },
  dpadCenter: { position: 'absolute', width: 20, height: 20, backgroundColor: '#E5C240', borderRadius: 2 },

  actionsContainer: { justifyContent: 'center', alignItems: 'center', gap: 15 },
  bigButton: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 6, borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.2)' },
  redBtn: { backgroundColor: COLORS.BUTTON_RED },
  greenBtn: { backgroundColor: COLORS.BUTTON_GREEN },
  smallButton: { width: 50, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 4, marginTop: 10, borderBottomWidth: 3, borderBottomColor: 'rgba(0,0,0,0.2)' },
  
  btnText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  smallBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  slotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 20, marginBottom: 10 },
  slot: { width: 60, height: 15, backgroundColor: '#4A7A85', borderRadius: 10 }
});

export default SignInScreen;