import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { MathMarkdown } from '../MathMarkdown';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

interface Flashcard {
    question: string;
    answer: string;
}

interface FlashcardDeckProps {
    cards: Flashcard[];
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const translateX = useSharedValue(0);
    const rotateY = useSharedValue(0);

    const nextCard = useCallback(() => {
        const nextIdx = (currentIndex + 1) % cards.length;
        setCurrentIndex(nextIdx);
        translateX.value = 0;
        setIsFlipped(false);
        rotateY.value = 0;
    }, [currentIndex, cards.length]);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            if (event.translationX < -SWIPE_THRESHOLD) {
                translateX.value = withTiming(-width, { duration: 250 }, () => {
                    runOnJS(nextCard)();
                });
            } else {
                translateX.value = withSpring(0);
            }
        });

    const animatedCardStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-width, 0, width],
            [-8, 0, 8],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value },
                { rotate: `${rotate}deg` }
            ],
        };
    });

    const frontAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${rotateY.value}deg` }],
            backfaceVisibility: 'hidden',
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${rotateY.value + 180}deg` }],
            backfaceVisibility: 'hidden',
        };
    });

    const flipCard = () => {
        rotateY.value = withSpring(isFlipped ? 0 : 180, { damping: 15, stiffness: 100 });
        setIsFlipped(!isFlipped);
    };

    const currentCard = cards[currentIndex];
    const cardNum = (currentIndex + 1).toString().padStart(2, '0');
    const totalNum = cards.length.toString().padStart(2, '0');

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.deck}>
                {/* Background Stacks - Editorial depth without shadows */}
                <View style={[styles.ghostCard, styles.ghostCard1]} />
                <View style={[styles.ghostCard, styles.ghostCard2]} />

                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
                        <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.card}>
                            {/* Front: Question */}
                            <Animated.View style={[styles.cardSide, styles.front, frontAnimatedStyle]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardIndicator}>Question</Text>
                                    <View style={styles.counterBadge}>
                                        <Text style={styles.counterText}>{cardNum} <Text style={{ opacity: 0.3 }}>/</Text> {totalNum}</Text>
                                    </View>
                                </View>
                                <MathMarkdown style={cardMarkdownStyles}>{currentCard.question}</MathMarkdown>
                                <View style={styles.flipAction}>
                                    <Text style={styles.flipActionText}>Tap to reveal</Text>
                                    <Ionicons name="arrow-forward" size={14} color="#0F172A" />
                                </View>
                            </Animated.View>

                            {/* Back: Answer */}
                            <Animated.View style={[styles.cardSide, styles.back, backAnimatedStyle]}>
                                <View style={styles.cardHeader}>
                                    <Text style={[styles.cardIndicator, { color: '#3B82F6' }]}>Answer</Text>
                                    <View style={[styles.counterBadge, { borderColor: '#DBEAFE' }]}>
                                        <Text style={[styles.counterText, { color: '#3B82F6' }]}>{cardNum} <Text style={{ opacity: 0.3 }}>/</Text> {totalNum}</Text>
                                    </View>
                                </View>
                                <MathMarkdown style={backCardMarkdownStyles}>{currentCard.answer}</MathMarkdown>
                                <View style={styles.flipAction}>
                                    <Text style={[styles.flipActionText, { color: '#3B82F6' }]}>Tap to flip back</Text>
                                    <Ionicons name="refresh" size={14} color="#3B82F6" />
                                </View>
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </GestureDetector>
            </View>

            <View style={styles.footer}>
                <View style={styles.swipeIndicatorContainer}>
                    <View style={styles.swipeDotActive} />
                    <View style={styles.swipeDot} />
                    <View style={styles.swipeDot} />
                </View>
                <Text style={styles.swipeLabel}>Swipe left for next mastery card</Text>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 520,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deck: {
        width: width - 48,
        height: 420,
        position: 'relative',
    },
    ghostCard: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 16,
        borderWidth: 2,
    },
    ghostCard1: {
        bottom: -8,
        right: -8,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
        zIndex: -1,
    },
    ghostCard2: {
        bottom: -16,
        right: -16,
        borderColor: '#F1F5F9',
        backgroundColor: '#FFFFFF',
        zIndex: -2,
    },
    cardContainer: {
        width: '100%',
        height: '100%',
    },
    card: {
        width: '100%',
        height: '100%',
    },
    cardSide: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 16,
        borderWidth: 2,
        paddingHorizontal: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    front: {
        backgroundColor: '#FFFFFF',
        borderColor: '#0F172A',
        zIndex: 1,
    },
    back: {
        backgroundColor: '#F1F7FF',
        borderColor: '#3B82F6',
        zIndex: 0,
    },
    cardHeader: {
        position: 'absolute',
        top: 24,
        left: 24,
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardIndicator: {
        fontSize: 11,
        fontFamily: 'FK-Grotesk-Bold',
        color: '#0F172A',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    counterBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    counterText: {
        fontSize: 10,
        fontFamily: 'FK-Grotesk-Bold',
        color: '#0F172A',
    },
    cardText: {
        fontSize: 26,
        fontFamily: 'Tiempos-Bold',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    flipAction: {
        position: 'absolute',
        bottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    flipActionText: {
        fontSize: 13,
        fontFamily: 'FK-Grotesk-Bold',
        color: '#0F172A',
        marginRight: 6,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    swipeIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    swipeDotActive: {
        width: 16,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0F172A',
    },
    swipeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E2E8F0',
    },
    swipeLabel: {
        fontSize: 13,
        fontFamily: 'FK-Grotesk-Medium',
        color: '#94A3B8',
        letterSpacing: -0.2,
    },
});

const cardMarkdownStyles = StyleSheet.create({
    body: {
        fontSize: 26,
        fontFamily: 'Tiempos-Bold',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
    }
});

const backCardMarkdownStyles = StyleSheet.create({
    body: {
        fontSize: 26,
        fontFamily: 'Tiempos-Bold',
        color: '#1E40AF',
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
    }
});
