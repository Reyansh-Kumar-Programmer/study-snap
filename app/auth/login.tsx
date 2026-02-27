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
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

const AnimatedBlob = ({ colors, size, initialPos, duration, delay = 0 }: { colors: readonly [string, string, ...string[]], size: number, initialPos: { x: number, y: number }, duration: number, delay?: number }) => {
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);
    const scale = useSharedValue(1);
    const rotate = useSharedValue(0);

    useEffect(() => {
        tx.value = withDelay(delay, withRepeat(withSequence(
            withTiming(40, { duration }),
            withTiming(-40, { duration: duration * 1.2 }),
            withTiming(0, { duration })
        ), -1));
        ty.value = withDelay(delay, withRepeat(withSequence(
            withTiming(-50, { duration: duration * 1.5 }),
            withTiming(50, { duration: duration * 0.8 }),
            withTiming(0, { duration: duration * 1.5 })
        ), -1));
        scale.value = withDelay(delay, withRepeat(withSequence(
            withTiming(1.2, { duration: duration * 2 }),
            withTiming(0.8, { duration: duration * 2 })
        ), -1));
        rotate.value = withRepeat(withTiming(360, { duration: duration * 5 }), -1);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: tx.value },
            { translateY: ty.value },
            { scale: scale.value },
            { rotate: `${rotate.value}deg` }
        ]
    }));

    return (
        <Animated.View
            style={[
                styles.blob,
                {
                    width: size,
                    height: size,
                    top: initialPos.y,
                    left: initialPos.x,
                    opacity: 0.5
                },
                animatedStyle
            ]}
        >
            <LinearGradient
                colors={colors}
                style={{ flex: 1, borderRadius: size / 2 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
        </Animated.View>
    );
};

export default function LoginScreen() {
    const router = useRouter();

    const handleGoogleSignIn = () => {
        // Mock sign in - in a real app, this would use expo-auth-session
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            {/* Animated Background Blobs */}
            <AnimatedBlob
                colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                size={300}
                initialPos={{ x: -100, y: -50 }}
                duration={4000}
            />
            <AnimatedBlob
                colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                size={250}
                initialPos={{ x: width - 150, y: height / 3 }}
                duration={5000}
                delay={500}
            />
            <AnimatedBlob
                colors={['#06B6D4', '#0891B2', '#0E7490']}
                size={200}
                initialPos={{ x: 50, y: height - 200 }}
                duration={6000}
                delay={1000}
            />

            <SafeAreaView style={styles.content}>
                <Animated.View
                    entering={FadeInDown.duration(800).delay(200)}
                    style={styles.header}
                >
                    <View style={styles.logoBadge}>
                        <Ionicons name="sparkles" size={32} color="white" />
                    </View>
                    <Text style={styles.appName}>StudySnap AI</Text>
                    <Text style={styles.tagline}>Your intelligent study companion</Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(800).delay(400)}
                    style={styles.cardContainer}
                >
                    <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint="light" style={styles.glassCard}>
                        <Text style={styles.cardTitle}>Welcome Back</Text>
                        <Text style={styles.cardSubtitle}>Unlock the power of AI-driven learning</Text>

                        <TouchableOpacity
                            onPress={handleGoogleSignIn}
                            activeOpacity={0.8}
                            style={styles.googleButtonWrapper}
                        >
                            <LinearGradient
                                colors={['#FFFFFF', '#F8FAFC']}
                                style={styles.googleButton}
                            >
                                <View style={styles.googleIconContainer}>
                                    <Image
                                        source={require('../../assets/images/google-logo.png')}
                                        style={styles.googleIcon}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text style={styles.googleButtonText}>Continue with Google</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.footerText}>
                            By continuing, you agree to our Terms and Service
                        </Text>
                    </BlurView>
                </Animated.View>

                <Animated.View
                    entering={FadeIn.duration(1000).delay(800)}
                    style={styles.bottomGraphic}
                >
                    <View style={styles.dotGrid}>
                        {[...Array(24)].map((_, i) => (
                            <View key={i} style={styles.dot} />
                        ))}
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    blob: {
        position: 'absolute',
        filter: 'blur(60px)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
    },
    logoBadge: {
        width: 70,
        height: 70,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        transform: [{ rotate: '10deg' }],
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 8,
        fontWeight: '500',
    },
    cardContainer: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 10,
    },
    glassCard: {
        width: '100%',
        borderRadius: 32,
        padding: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    googleButtonWrapper: {
        width: '100%',
    },
    googleButton: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    googleIconContainer: {
        marginRight: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        width: 20,
        height: 20,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#334155',
    },
    footerText: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 24,
        lineHeight: 18,
    },
    bottomGraphic: {
        width: '100%',
        alignItems: 'center',
    },
    dotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 120,
        justifyContent: 'center',
        gap: 12,
        opacity: 0.2,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#64748B',
    }
});
