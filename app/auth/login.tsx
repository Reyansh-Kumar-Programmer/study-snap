import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    FadeIn,
    FadeInDown,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const TITLES = [
    "Master Your Focus",
    "Redefine Mastery",
    "Amplify Productivity",
    "Unlock Potential"
];

const TypingText = () => {
    const [index, setIndex] = React.useState(0);
    const [displayText, setDisplayText] = React.useState('');
    const [isDeleting, setIsDeleting] = React.useState(false);

    useEffect(() => {
        const title = TITLES[index];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < title.length) {
                    setDisplayText(title.substring(0, displayText.length + 1));
                } else {
                    // Pause at end
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(title.substring(0, displayText.length - 1));
                } else {
                    setIsDeleting(false);
                    setIndex((prev) => (prev + 1) % TITLES.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, index]);

    return (
        <View style={styles.typingContainer}>
            <Text style={styles.heroTitle}>{displayText}<Text style={styles.cursor}>|</Text></Text>
        </View>
    );
};

const AmbientLight = ({ colors, size, initialPos, duration, delay = 0, opacity = 1 }: { colors: string[], size: number, initialPos: { x: number, y: number }, duration: number, delay?: number, opacity?: number }) => {
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    // Use a stable ID for the gradient
    const gradId = React.useMemo(() => `grad-${Math.floor(Math.random() * 1000000)}`, []);

    useEffect(() => {
        // Complex, non-linear motion paths
        tx.value = withDelay(delay, withRepeat(withSequence(
            withTiming(width * 0.15, { duration: duration * 0.8 }),
            withTiming(-width * 0.1, { duration: duration * 1.2 }),
            withTiming(0, { duration: duration * 1.0 })
        ), -1));
        
        ty.value = withDelay(delay, withRepeat(withSequence(
            withTiming(-height * 0.1, { duration: duration * 1.1 }),
            withTiming(height * 0.15, { duration: duration * 0.9 }),
            withTiming(0, { duration: duration * 1.0 })
        ), -1));

        scale.value = withDelay(delay, withRepeat(withSequence(
            withTiming(1.3, { duration: duration * 2 }),
            withTiming(0.8, { duration: duration * 2.5 }),
            withTiming(1, { duration: duration * 1.5 })
        ), -1));

        rotation.value = withDelay(delay, withRepeat(withTiming(360, { duration: duration * 5 }), -1));
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: tx.value },
                { translateY: ty.value },
                { scale: scale.value },
                { rotate: `${rotation.value}deg` }
            ]
        };
    });

    return (
        <Animated.View
            style={[
                styles.ambientLight,
                {
                    width: size,
                    height: size,
                    top: initialPos.y,
                    left: initialPos.x,
                    opacity: opacity,
                },
                animatedStyle
            ]}
        >
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Defs>
                    <RadialGradient
                        id={gradId}
                        cx="50%"
                        cy="50%"
                        rx="50%"
                        ry="50%"
                        fx="50%"
                        fy="50%"
                        gradientUnits="objectBoundingBox"
                    >
                        <Stop offset="0%" stopColor={colors[0]} stopOpacity="0.9" />
                        <Stop offset="50%" stopColor={colors[colors.length > 1 ? 1 : 0]} stopOpacity="0.4" />
                        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Circle cx="50" cy="50" r="50" fill={`url(#${gradId})`} />
            </Svg>
        </Animated.View>
    );
};

export default function LoginScreen() {
    const router = useRouter();

    const handleGoogleSignIn = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            {/* V4: Multi-Layer Liquid Background */}
            <View style={styles.backgroundLayer}>
                {/* Core Deep Colors */}
                <AmbientLight
                    colors={['#4F46E5', '#6366F1']}
                    size={width * 2}
                    initialPos={{ x: -width * 0.4, y: -height * 0.25 }}
                    duration={15000}
                    opacity={0.95}
                />
                <AmbientLight
                    colors={['#9333EA', '#A855F7']}
                    size={width * 1.8}
                    initialPos={{ x: width * 0.3, y: height * 0.4 }}
                    duration={18000}
                    delay={1000}
                    opacity={0.9}
                />
                <AmbientLight
                    colors={['#06B6D4', '#0EA5E9']}
                    size={width * 1.6}
                    initialPos={{ x: -width * 0.2, y: height * 0.5 }}
                    duration={12000}
                    delay={3000}
                    opacity={0.85}
                />
                <AmbientLight
                    colors={['#F472B6', '#EC4899']}
                    size={width * 1.4}
                    initialPos={{ x: width * 0.4, y: -height * 0.1 }}
                    duration={20000}
                    delay={5000}
                    opacity={0.7}
                />
                <AmbientLight
                    colors={['#818CF8', '#4F46E5']}
                    size={width * 2.2}
                    initialPos={{ x: -width * 0.1, y: height * 0.65 }}
                    duration={25000}
                    opacity={0.75}
                />
            </View>

            {/* Premium Glass Layer — lower intensity so the blobs show through */}
            <BlurView intensity={Platform.OS === 'ios' ? 60 : 75} tint="light" style={StyleSheet.absoluteFill} />
            
            {/* Very light contrast overlay so text stays readable */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.12)' }]} />

            <SafeAreaView style={styles.content}>
                <View style={styles.header}>
                    <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.logoSlot}>
                        <View style={styles.logoGlass}>
                            <Ionicons name="sparkles" size={24} color="#4F46E5" />
                        </View>
                    </Animated.View>
                    
                    <Animated.View entering={FadeInDown.duration(1000).delay(300)}>
                        <TypingText />
                        <Text style={styles.heroSubtitle}>Intelligent study companions driven by Google Gemini. Redefining how we learn.</Text>
                    </Animated.View>
                </View>

                <View style={styles.bottomSection}>
                    <Animated.View entering={FadeInDown.duration(1000).delay(500)} style={styles.loginGroup}>
                        <TouchableOpacity
                            onPress={handleGoogleSignIn}
                            activeOpacity={0.9}
                            style={styles.premiumButton}
                        >
                            <View style={styles.googleOrb}>
                                <Image
                                    source={require('../../assets/images/google-logo.png')}
                                    style={styles.googleLogo}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.buttonLabel}>Continue with Google</Text>
                        </TouchableOpacity>

                        <Text style={styles.policyText}>
                            Designed with privacy in mind. By joining you agree to our <Text style={styles.boldLink}>Terms</Text>.
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeIn.duration(1500).delay(1000)} style={styles.brandFooter}>
                        <Text style={styles.brandPowered}>Powered by</Text>
                        <Text style={styles.brandText}>WellnessNXT Solutions</Text>
                    </Animated.View>
                </View>
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
        backgroundColor: '#F8FAFC',
    },
    ambientLight: {
        position: 'absolute',
    },
    content: {
        flex: 1,
        paddingHorizontal: 28,
    },
    header: {
        marginTop: height * 0.12,
    },
    logoSlot: {
        marginBottom: 40,
    },
    logoGlass: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 3,
    },
    heroTitle: {
        fontSize: 52,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
        lineHeight: 60,
        letterSpacing: -1.5,
        minHeight: 120, // Keep layout stable during typing
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    cursor: {
        color: '#4F46E5',
        opacity: 0.6,
        fontFamily: 'FKGrotesk-Medium',
    },
    heroSubtitle: {
        fontSize: 18,
        fontFamily: 'FKGrotesk-Regular',
        color: '#334155',
        lineHeight: 28,
        marginTop: 20,
        opacity: 0.8,
    },
    bottomSection: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 30,
    },
    loginGroup: {
        gap: 20,
    },
    premiumButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        backgroundColor: '#0F172A',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
    },
    googleOrb: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    googleLogo: {
        width: 16,
        height: 16,
    },
    buttonLabel: {
        fontSize: 17,
        fontFamily: 'FKGrotesk-Medium',
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },
    policyText: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Regular',
        color: '#64748B',
        textAlign: 'center',
    },
    boldLink: {
        color: '#0F172A',
        fontFamily: 'FKGrotesk-Medium',
        textDecorationLine: 'underline',
    },
    brandFooter: {
        marginTop: 48,
        alignItems: 'center',
        gap: 2,
    },
    brandPowered: {
        fontSize: 10,
        fontFamily: 'FKGrotesk-Regular',
        color: '#94A3B8',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    brandText: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Medium',
        color: '#475569',
        letterSpacing: 0.4,
    },
});
