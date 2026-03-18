import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  Platform, 
  Image,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const ACCENT_COLOR = '#7C3AED'; // Deep Violet
const SECONDARY_ACCENT = '#C084FC'; // Soft Purple

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focused, setFocused] = useState<string | null>(null);

    const handleLogin = () => {
        router.replace('/home');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            {/* Static Ethereal Background */}
            <View style={styles.backgroundLayer}>
                <View style={[styles.staticBlob, { 
                    width: width * 1.5, 
                    height: width * 1.5, 
                    top: -height * 0.1, 
                    left: -width * 0.3,
                    opacity: 0.3
                }]}>
                    <Svg height="100%" width="100%" viewBox="0 0 100 100">
                        <Defs>
                            <RadialGradient id="grad1" cx="50%" cy="50%" rx="50%" ry="50%">
                                <Stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.8" />
                                <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="50" cy="50" r="50" fill="url(#grad1)" />
                    </Svg>
                </View>
                <View style={[styles.staticBlob, { 
                    width: width * 1.2, 
                    height: width * 1.2, 
                    top: height * 0.5, 
                    left: width * 0.4,
                    opacity: 0.3
                }]}>
                    <Svg height="100%" width="100%" viewBox="0 0 100 100">
                        <Defs>
                            <RadialGradient id="grad2" cx="50%" cy="50%" rx="50%" ry="50%">
                                <Stop offset="0%" stopColor={SECONDARY_ACCENT} stopOpacity="0.8" />
                                <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="50" cy="50" r="50" fill="url(#grad2)" />
                    </Svg>
                </View>
            </View>

            <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <LinearGradient
                                    colors={[ACCENT_COLOR, SECONDARY_ACCENT]}
                                    style={styles.logoGradient}
                                >
                                    <Ionicons name="school-outline" size={26} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.brandName}>TutorXpert</Text>
                            </View>

                            <Text style={styles.mainTitle}>Elevate your learning experience.</Text>
                            <Text style={styles.subTitle}>Simple, powerful, and tailored to your growth.</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <View style={[styles.inputWrapper, focused === 'email' && styles.focusedWrapper]}>
                                    <Ionicons 
                                        name="mail-outline" 
                                        size={20} 
                                        color={focused === 'email' ? ACCENT_COLOR : '#94A3B8'} 
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email Address"
                                        placeholderTextColor="#94A3B8"
                                        value={email}
                                        onChangeText={setEmail}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused(null)}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={[styles.inputWrapper, focused === 'password' && styles.focusedWrapper]}>
                                    <Ionicons 
                                        name="lock-closed-outline" 
                                        size={20} 
                                        color={focused === 'password' ? ACCENT_COLOR : '#94A3B8'} 
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor="#94A3B8"
                                        value={password}
                                        onChangeText={setPassword}
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused(null)}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Get Started</Text>
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.line} />
                                <Text style={styles.dividerText}>or continue with</Text>
                                <View style={styles.line} />
                            </View>

                            <TouchableOpacity activeOpacity={0.7} style={styles.googleButton}>
                                <Image 
                                    source={require('../assets/images/google-logo.png')} 
                                    style={styles.googleLogo} 
                                />
                                <Text style={styles.googleButtonText}>Continue with Google</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                New here? <Text style={styles.signUpLink}>Create an account</Text>
                            </Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FCFCFE',
    },
    staticBlob: {
        position: 'absolute',
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 36,
        paddingTop: height * 0.05,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 48,
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    logoGradient: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: ACCENT_COLOR,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    brandName: {
        fontSize: 22,
        fontFamily: 'FKGrotesk-Medium',
        color: '#1E293B',
        letterSpacing: -0.5,
    },
    mainTitle: {
        fontSize: 32,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.8,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        gap: 16,
        marginBottom: 24,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#ffffff80', // 50% opacity
        borderRadius: 18,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0CC', // 80% opacity
    },
    focusedWrapper: {
        borderColor: ACCENT_COLOR,
        backgroundColor: '#FFF',
        shadowColor: ACCENT_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#0F172A',
    },
    loginButton: {
        height: 60,
        backgroundColor: '#1E293B',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    loginButtonText: {
        fontSize: 17,
        fontFamily: 'FKGrotesk-Medium',
        color: '#FFF',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F099', // 60% opacity
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 14,
        fontFamily: 'FKGrotesk-Regular',
        color: '#94A3B8',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        backgroundColor: 'transparent',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    googleLogo: {
        width: 20,
        height: 20,
        marginRight: 12,
    },
    googleButtonText: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Medium',
        color: '#475569',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: '#64748B',
    },
    signUpLink: {
        color: ACCENT_COLOR,
        fontFamily: 'FKGrotesk-Medium',
    },
});
