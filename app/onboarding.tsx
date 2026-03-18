import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  FlatList,
  Animated as RNAnimated,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
    FadeInDown, 
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const ACCENT_COLOR = '#7C3AED';
const SECONDARY_ACCENT = '#C084FC';

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'Learn from the Best',
        description: 'Connect with expert tutors world-wide for personalized learning sessions.',
        lottie: require('../assets/lottie/onboarding1.json'),
        subtitle: 'EXPERT GUIDANCE'
    },
    {
        id: '2',
        title: 'Study Anywhere, Anytime',
        description: 'Flexible scheduling that fits your lifestyle. Education at your fingertips.',
        lottie: require('../assets/lottie/onboarding2.json'),
        subtitle: 'FLEXIBLE LEARNING'
    }
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new RNAnimated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const buttonScale = useSharedValue(1);

    const scrollToNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/home');
        }
    };

    const handlePressIn = () => {
        buttonScale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        buttonScale.value = withSpring(1);
    };

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }]
    }));

    const handleSkip = () => {
        Haptics.selectionAsync();
        router.replace('/home');
    };

    const renderItem = ({ item, index }: any) => {
        return (
            <View style={styles.slide}>
                <View style={styles.lottieContainer}>
                    <LottieView
                        source={item.lottie}
                        autoPlay
                        loop
                        style={styles.lottie}
                        renderMode="SOFTWARE"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}>
                        <Text style={styles.subtitle}>{item.subtitle}</Text>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </Animated.View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />
            
            <SafeAreaView style={styles.safeArea}>
                {/* Skip Button */}
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <FlatList
                    data={ONBOARDING_DATA}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />

                <View style={styles.footer}>
                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {ONBOARDING_DATA.map((_, i) => {
                            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [10, 24, 10],
                                extrapolate: 'clamp',
                            });
                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });
                            return (
                                <RNAnimated.View 
                                    key={i.toString()} 
                                    style={[styles.dot, { width: dotWidth, opacity, backgroundColor: ACCENT_COLOR }]} 
                                />
                            );
                        })}
                    </View>

                    {/* Next/Get Started Button */}
                    <Animated.View style={[styles.nextButtonContainer, animatedButtonStyle]}>
                        <TouchableOpacity 
                            onPress={scrollToNext} 
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            activeOpacity={0.9} 
                            style={styles.touchableWrapper}
                        >
                            <LinearGradient
                                colors={[ACCENT_COLOR, '#6D28D9']}
                                style={styles.nextButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.nextButtonText}>
                                    {currentIndex === ONBOARDING_DATA.length - 1 ? 'Start Learning' : 'Continue'}
                                </Text>
                                <View style={styles.iconCircle}>
                                    <Ionicons 
                                        name={currentIndex === ONBOARDING_DATA.length - 1 ? "rocket" : "arrow-forward"} 
                                        size={18} 
                                        color={ACCENT_COLOR} 
                                    />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
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
    safeArea: {
        flex: 1,
    },
    skipButton: {
        paddingHorizontal: 30,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    skipText: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Medium',
        color: '#94A3B8',
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    lottieContainer: {
        flex: 0.6,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: width * 0.8,
        height: width * 0.8,
    },
    textContainer: {
        flex: 0.4,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'FKGrotesk-Medium',
        color: ACCENT_COLOR,
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.8,
    },
    footer: {
        paddingHorizontal: 40,
        paddingBottom: height * 0.05,
    },
    pagination: {
        flexDirection: 'row',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    nextButtonContainer: {
        width: '100%',
    },
    touchableWrapper: {
        shadowColor: ACCENT_COLOR,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 10,
    },
    nextButton: {
        height: 64,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 32,
        paddingRight: 8,
    },
    nextButtonText: {
        fontSize: 18,
        fontFamily: 'FKGrotesk-Medium',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
});
