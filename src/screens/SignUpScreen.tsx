import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ScrollView
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// --- BMO COLORS (Same as Login) ---
const COLORS = {
  BODY: "#639FAB",
  SCREEN_BG: "#D6F8E8",
  SCREEN_BORDER: "#4A7A85", 
  BUTTON_RED: "#FF595E",
  BUTTON_GREEN: "#8AC926",
  DPAD: "#F4D35E",
  TEXT_DARK: "#2A454B"
};

const SignUpScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- ANIMATION: BLINKING EYES ---
  const eyeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeoutId: any;
    const blink = () => {
      Animated.sequence([
        Animated.timing(eyeScale, { toValue: 0.1, duration: 150, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(eyeScale, { toValue: 1, duration: 150, useNativeDriver: true, easing: Easing.linear }),
      ]).start(() => {
        const nextBlink = Math.random() * 4000 + 2000;
        timeoutId = setTimeout(blink, nextBlink);
      });
    };
    blink();
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSignUp = async () => {
    // 1. Basic Validation
    if (!email || !password || !username) {
      Alert.alert('BMO Says:', 'Please fill in all fields!');
      return;
    }

    setLoading(true);

    try {
      // 2. Create User in Firebase
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      // 3. Create User Profile in Firestore
      await firestore().collection('users').doc(uid).set({
        username: username,
        email: email,
        pokedexCount: 0,
        joinDate: new Date().toDateString(),
        pokedex: [] 
      });

      Alert.alert('Success', 'Account created! Welcome!', [
        { text: 'Let\'s Go!', onPress: () => navigation.replace('MainTabs') }
      ]);

    } catch (error: any) {
      console.log(error);
      let errorMessage = 'Something went wrong';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'That email is taken!';
      else if (error.code === 'auth/invalid-email') errorMessage = 'That email looks fake!';
      else if (error.code === 'auth/weak-password') errorMessage = 'Password too short (min 6 chars).';
      
      Alert.alert('Sign Up Failed', errorMessage);
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.bodyContainer}>
            
            {/* --- MONITOR SECTION --- */}
            <View style={styles.monitorContainer}>
              <View style={styles.screen}>
                
                {/* FACE (Smaller to fit inputs) */}
                <View style={styles.faceContainer}>
                  <View style={styles.eyesRow}>
                    <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeScale }] }]} />
                    <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeScale }] }]} />
                  </View>
                  {/* Happy Smile for Sign Up */}
                  <View style={styles.mouth} /> 
                </View>

                {/* INPUTS */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>TRAINER NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ash Ketchum"
                    placeholderTextColor="rgba(42, 69, 75, 0.5)"
                    value={username}
                    onChangeText={setUsername}
                  />

                  <Text style={styles.label}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="pika@chu.com"
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

            {/* --- CONTROLS SECTION --- */}
            <View style={styles.controlsContainer}>
              
              {/* D-PAD (Decoration) */}
              <View style={styles.dpadContainer}>
                <View style={styles.dpadVertical} />
                <View style={styles.dpadHorizontal} />
                <View style={styles.dpadCenter} />
              </View>

              {/* BUTTONS */}
              <View style={styles.actionsContainer}>
                
                {/* BIG RED -> SIGN UP (ACTION) */}
                <TouchableOpacity 
                  style={[styles.bigButton, styles.redBtn]} 
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>OK</Text>}
                </TouchableOpacity>

                {/* SMALL GREEN -> BACK (CANCEL) */}
                <TouchableOpacity 
                  style={[styles.smallButton, styles.greenBtn]} 
                  onPress={() => navigation.navigate('SignIn')}
                >
                  <Text style={styles.smallBtnText}>BACK</Text>
                </TouchableOpacity>

              </View>
            </View>

             {/* SLOTS */}
            <View style={styles.slotsRow}>
               <View style={styles.slot} />
               <View style={styles.slot} />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BODY },
  scrollContent: { flexGrow: 1 },
  bodyContainer: { flex: 1, padding: 20, justifyContent: 'space-between' },

  // SCREEN
  monitorContainer: { backgroundColor: COLORS.BODY, padding: 15, borderRadius: 20, elevation: 10, marginBottom: 10 },
  screen: { 
    backgroundColor: COLORS.SCREEN_BG, 
    borderRadius: 15, 
    padding: 20, 
    height: 450, // Taller for 3 inputs
    borderWidth: 4, 
    borderColor: COLORS.SCREEN_BORDER, 
    justifyContent: 'flex-start' 
  },

  // FACE
  faceContainer: { alignItems: 'center', marginBottom: 20 },
  eyesRow: { flexDirection: 'row', justifyContent: 'space-between', width: 80, marginBottom: 10 },
  eye: { width: 15, height: 15, backgroundColor: COLORS.TEXT_DARK, borderRadius: 8 },
  mouth: { 
    width: 40, height: 20, 
    borderBottomWidth: 3, borderColor: COLORS.TEXT_DARK, borderRadius: 20 // Smile
  },

  // INPUTS
  inputGroup: { flex: 1, justifyContent: 'center' },
  label: { 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    color: COLORS.TEXT_DARK, fontWeight: 'bold', marginBottom: 2, marginLeft: 4, fontSize: 10, letterSpacing: 1 
  },
  input: { 
    backgroundColor: 'rgba(255,255,255,0.4)', 
    borderWidth: 2, borderColor: COLORS.TEXT_DARK, borderRadius: 10, 
    paddingHorizontal: 15, height: 45, marginBottom: 10, 
    color: COLORS.TEXT_DARK, fontSize: 14, fontWeight: 'bold' 
  },

  // CONTROLS
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, height: 120 },
  dpadContainer: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  dpadVertical: { position: 'absolute', width: 25, height: 75, backgroundColor: COLORS.DPAD, borderRadius: 5, elevation: 4 },
  dpadHorizontal: { position: 'absolute', width: 75, height: 25, backgroundColor: COLORS.DPAD, borderRadius: 5, elevation: 4 },
  dpadCenter: { position: 'absolute', width: 15, height: 15, backgroundColor: '#E5C240', borderRadius: 2 },

  actionsContainer: { justifyContent: 'center', alignItems: 'center', gap: 10 },
  bigButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 6, borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.2)' },
  redBtn: { backgroundColor: COLORS.BUTTON_RED },
  greenBtn: { backgroundColor: COLORS.BUTTON_GREEN },
  smallButton: { width: 50, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 4, marginTop: 5, borderBottomWidth: 3, borderBottomColor: 'rgba(0,0,0,0.2)' },
  
  btnText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  smallBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },

  slotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 10 },
  slot: { width: 60, height: 15, backgroundColor: '#4A7A85', borderRadius: 10 }
});

export default SignUpScreen;