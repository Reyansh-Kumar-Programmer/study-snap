import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSpring,
    FadeIn,
    Easing
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const logoScale = useSharedValue(0.3);
    const logoOpacity = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(20);

    useEffect(() => {
        // Start animations
        logoScale.value = withSpring(1, { damping: 12 });
        logoOpacity.value = withTiming(1, { duration: 1000 });

        titleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
        titleTranslateY.value = withDelay(600, withTiming(0, { duration: 800, easing: Easing.out(Easing.back(1.5)) }));

        // Navigate to onboarding after delay
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const titleAnimatedStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }],
    }));

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#EFF6FF']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.content}>
                <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                    <LinearGradient
                        colors={['#2563EB', '#3B82F6']}
                        style={styles.logoBadge}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="sparkles" size={60} color="white" />
                    </LinearGradient>
                </Animated.View>

                <Animated.View style={[styles.textContainer, titleAnimatedStyle]}>
                    <Text style={styles.appName}>StudySnap AI</Text>
                    <View style={styles.loaderLine}>
                        <Animated.View
                            entering={FadeIn.delay(1000).duration(2000)}
                            style={styles.loaderFill}
                        />
                    </View>
                </Animated.View>
            </SafeAreaView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Powered by Advanced AI</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoBadge: {
        width: 140,
        height: 140,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
        transform: [{ rotate: '-10deg' }],
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    appName: {
        fontSize: 36,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -1,
    },
    loaderLine: {
        width: 120,
        height: 4,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderRadius: 2,
        marginTop: 16,
        overflow: 'hidden',
    },
    loaderFill: {
        width: '60%',
        height: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
