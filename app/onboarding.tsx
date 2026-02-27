import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    FadeIn,
    FadeInUp,
    SlideInRight,
    SlideOutLeft,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
    {
        id: 1,
        title: 'Scan your notes\ninstantly',
        description: 'Take a photo of handwritten or book notes and let AI do the rest',
        icon: 'camera-outline',
        iconType: 'Ionicons',
        colors: ['#3B82F6', '#2563EB', '#1E40AF'],
    },
    {
        id: 2,
        title: 'AI explains\neverything',
        description: 'Understand any topic in seconds with clear, simple explanations',
        icon: 'brain',
        iconType: 'MaterialCommunityIcons',
        colors: ['#8B5CF6', '#7C3AED', '#5B21B6'],
    },
    {
        id: 3,
        title: 'Revise smarter\nwith AI',
        description: 'Get summaries and quizzes automatically generated from your notes',
        icon: 'sparkles-outline',
        iconType: 'Ionicons',
        colors: ['#06B6D4', '#0891B2', '#155E75'],
    }
] as const;

export default function OnboardingScreen() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleContinue = () => {
        if (activeIndex < ONBOARDING_DATA.length - 1) {
            setActiveIndex(prev => prev + 1);
        } else {
            router.replace('/auth/login');
        }
    };

    const handleSkip = () => {
        router.replace('/auth/login');
    };

    const currentData = ONBOARDING_DATA[activeIndex];

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <Animated.View
                key={activeIndex}
                entering={activeIndex === 0 ? FadeIn.duration(800) : SlideInRight.duration(500)}
                exiting={SlideOutLeft.duration(500)}
                style={styles.contentContainer}
            >
                {/* Orbital Icon Section */}
                <Animated.View
                    key={`icon-${activeIndex}`}
                    entering={FadeInUp.delay(100).duration(600)}
                    style={styles.iconWrapper}
                >
                    <View style={styles.orbitalA}>
                        <View style={styles.orbitalDot} />
                    </View>
                    <View style={styles.orbitalB}>
                        <View style={[styles.orbitalDot, { bottom: 0, left: 20 }]} />
                    </View>

                    <LinearGradient
                        colors={currentData.colors}
                        style={styles.mainIconContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {currentData.iconType === 'Ionicons' ? (
                            <Ionicons name={currentData.icon as any} size={70} color="white" />
                        ) : (
                            <MaterialCommunityIcons name={currentData.icon as any} size={70} color="white" />
                        )}
                    </LinearGradient>

                    {/* Shadow Layer */}
                    <View style={[styles.iconShadow, { shadowColor: currentData.colors[0] }]} />
                </Animated.View>

                {/* Text Content */}
                <Animated.View
                    key={`text-${activeIndex}`}
                    entering={FadeInUp.delay(300).springify()}
                    style={styles.textSection}
                >
                    <Text style={styles.title}>{currentData.title}</Text>
                    <Text style={styles.description}>{currentData.description}</Text>
                </Animated.View>
            </Animated.View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Pagination */}
                <View style={styles.pagination}>
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === activeIndex ? styles.activeDot : null
                            ]}
                        />
                    ))}
                </View>

                {/* Main Button */}
                <TouchableOpacity
                    onPress={handleContinue}
                    activeOpacity={0.9}
                    style={styles.buttonWrapper}
                >
                    <LinearGradient
                        colors={['#2563EB', '#3B82F6']}
                        style={styles.button}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>
                            {activeIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Continue'}
                        </Text>
                        <Ionicons name="chevron-forward" size={18} color="white" style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFDFF',
    },
    topBar: {
        height: 60,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    skipText: {
        fontSize: 16,
        color: '#94A3B8',
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconWrapper: {
        width: 220,
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    mainIconContainer: {
        width: 170,
        height: 170,
        borderRadius: 85,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        zIndex: 2,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    orbitalA: {
        position: 'absolute',
        width: 210,
        height: 210,
        borderRadius: 105,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
    },
    orbitalB: {
        position: 'absolute',
        width: 230,
        height: 230,
        borderRadius: 115,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.05)',
    },
    orbitalDot: {
        position: 'absolute',
        top: 20,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconShadow: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.3,
        shadowRadius: 35,
        elevation: 30,
        zIndex: 1,
    },
    textSection: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E40AF',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 36,
    },
    description: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: '#3B82F6',
    },
    buttonWrapper: {
        width: '100%',
        maxWidth: 300,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    button: {
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
});
