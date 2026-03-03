import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const TAGLINES = [
    'Elevate your learning experience.',
    'Master your studies, minimalistically.',
    'Your personal AI study assistant.',
    'Focus on what truly matters.',
];

// Speed Configurations (ms)
const TYPING_SPEED = 60;
const DELETING_SPEED = 30;
const PAUSE_BEFORE_DELETE = 2000;
const PAUSE_BEFORE_TYPE = 500;

export default function LoginScreen() {
    const router = useRouter();

    const [displayedText, setDisplayedText] = useState('');
    const [taglineIndex, setTaglineIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Use Refs to keep track of current mutable state within the timeout closures
    const textRef = useRef('');
    const idxRef = useRef(0);
    const deletingRef = useRef(false);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const handleType = () => {
            const currentTagline = TAGLINES[idxRef.current];
            const isFull = textRef.current === currentTagline;
            const isEmpty = textRef.current === '';

            if (!deletingRef.current && isFull) {
                // Pause at the end before deleting
                deletingRef.current = true;
                setIsDeleting(true);
                timeoutId = setTimeout(handleType, PAUSE_BEFORE_DELETE);
            } else if (deletingRef.current && isEmpty) {
                // Move to next string and pause before typing
                deletingRef.current = false;
                setIsDeleting(false);
                idxRef.current = (idxRef.current + 1) % TAGLINES.length;
                setTaglineIndex(idxRef.current);
                timeoutId = setTimeout(handleType, PAUSE_BEFORE_TYPE);
            } else {
                // Type or Delete one character
                const nextStrLength = textRef.current.length + (deletingRef.current ? -1 : 1);
                textRef.current = currentTagline.substring(0, nextStrLength);
                setDisplayedText(textRef.current);

                const speed = deletingRef.current ? DELETING_SPEED : TYPING_SPEED;
                timeoutId = setTimeout(handleType, speed);
            }
        };

        // Start typing
        timeoutId = setTimeout(handleType, PAUSE_BEFORE_TYPE);

        return () => clearTimeout(timeoutId);
    }, []);

    const handleGoogleSignIn = () => {
        // Mock sign in
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            {/* Ultra-subtle light gradient */}
            <LinearGradient
                colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Soft Glowing Accent - Light Mode friendly */}
            <Animated.View
                entering={FadeIn.duration(2000)}
                style={styles.glowAccent}
            />

            <SafeAreaView style={styles.content}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Animated.View entering={FadeInDown.duration(1000).delay(200)} style={styles.logoContainer}>
                        <Ionicons name="sparkles" size={36} color="#2563EB" />
                    </Animated.View>

                    <Animated.Text
                        entering={FadeInDown.duration(1000).delay(400)}
                        style={styles.appName}
                    >
                        StudySnap
                    </Animated.Text>

                    <Animated.Text
                        entering={FadeInDown.duration(1000).delay(500)}
                        style={styles.tagline}
                    >
                        {displayedText}
                        <Animated.Text
                            entering={FadeIn.duration(500).delay(1000)}
                            style={{ color: '#2563EB' }}
                        >
                            {isDeleting || (displayedText.length === TAGLINES[taglineIndex].length) ? '' : '|'}
                        </Animated.Text>
                    </Animated.Text>
                </View>

                {/* Bottom Section */}
                <Animated.View
                    entering={FadeInUp.duration(1000).delay(800)}
                    style={styles.bottomSection}
                >
                    <TouchableOpacity
                        onPress={handleGoogleSignIn}
                        activeOpacity={0.8}
                        style={styles.googleButtonWrapper}
                    >
                        <View style={styles.googleButton}>
                            <Ionicons name="logo-google" size={20} color="#0F172A" style={styles.googleIcon} />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        By continuing, you accept our
                        <Text style={styles.linkText}> Terms</Text> &
                        <Text style={styles.linkText}> Privacy Policy</Text>
                    </Text>

                    <View style={styles.footerBrand}>
                        <Text style={styles.footerBrandText}>Powered by WellnessNXT Solutions</Text>
                    </View>
                </Animated.View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    glowAccent: {
        position: 'absolute',
        top: '-10%',
        left: '-20%',
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        backgroundColor: '#60A5FA', // Soft blue light accent
        opacity: 0.15,
        filter: 'blur(90px)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    header: {
        marginTop: height * 0.1,
        alignItems: 'flex-start',
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
    },
    appName: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 48,
        color: '#0F172A', // Dark slate for pristine contrast
        letterSpacing: -1.5,
        marginBottom: 12,
    },
    tagline: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 18,
        color: '#64748B',
        letterSpacing: 0.5,
        minHeight: 28, // Prevent layout shift while typing
    },
    bottomSection: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 20,
    },
    googleButtonWrapper: {
        width: '100%',
        marginBottom: 24,
    },
    googleButton: {
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 6,
    },
    googleIcon: {
        marginRight: 12,
    },
    googleButtonText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#0F172A',
        letterSpacing: 0.5,
    },
    termsText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
    },
    linkText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#64748B',
    },
    footerBrand: {
        position: 'absolute',
        bottom: -30,
        width: '100%',
        alignItems: 'center',
    },
    footerBrandText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#CBD5E1',
        letterSpacing: 0.2,
    }
});
