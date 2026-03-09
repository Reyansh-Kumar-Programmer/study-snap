import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput, KeyboardAvoidingView, LayoutAnimation, UIManager, Share, Modal, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, FadeInUp, FadeInRight, FadeInLeft, useAnimatedStyle, withTiming, interpolateColor, useSharedValue, withSpring, withRepeat, withDelay, withSequence, interpolate, runOnJS, SlideInDown, SlideOutDown, Easing, Layout } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { MathMarkdown } from '@/components/MathMarkdown';
import { FlashcardDeck } from '@/components/revision/FlashcardDeck';
import { generateRevisionSheet, sendChatMessage, RevisionMaterial } from '@/services/geminiService';

const { width, height } = Dimensions.get('window');
const SIMULATED_MODAL_HEIGHT = height * 0.75;

// Mock Data Structure
const MOCK_REVISION_DATA = {
    topic: "Quantum Mechanics",
    subtitle: "The Foundation of Modern Physics",
    summary: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science. Unlike classical physics, quantum mechanics introduces concepts like wave-particle duality, quantization of energy, and the uncertainty principle, which challenge our macroscopic intuitions about the universe.",
    keyConcepts: [
        { term: "Wave-Particle Duality", definition: "Every particle or quantum entity may be described as either a particle or a wave." },
        { term: "Quantization", definition: "The process of transitioning from a classical to a quantum description of a physical system." },
        { term: "Uncertainty Principle", definition: "The position and velocity of an object cannot both be measured exactly at the same time." },
        { term: "Superposition", definition: "A fundamental principle of quantum mechanics where a physical system exists in all possible states simultaneously." },
        { term: "Entanglement", definition: "A phenomenon where particles become correlated such that the state of one instantly influences the other." }
    ],
    flow: [
        "Classical Physics Limits",
        "Black Body Radiation",
        "Photoelectric Effect",
        "Schrödinger Equation",
        "Quantum Computing",
        "The Future of Information"
    ],
    examQuestions: [
        { question: "Explain the concept of wave-particle duality using the double-slit experiment.", type: "Conceptual", answer: "The double-slit experiment shows that light and matter can display characteristics of both classically defined waves and particles. When observed, particles pass through straight; unobserved, they create interference patterns." },
        { question: "Derive the basic form of the Heisenberg Uncertainty Principle.", type: "Mathematical", answer: "ΔxΔp ≥ ℏ/2. This states that the more precisely the position (x) of some particle is determined, the less precisely its momentum (p) can be predicted from initial conditions, and vice versa." },
        { question: "Discuss the implications of quantum entanglement on local realism.", type: "Theoretical", answer: "Entanglement violates local realism by showing that measurement of one particle instantaneously influences another, regardless of distance, defying the classical idea that influences cannot travel faster than light." },
        { question: "How does the Pauli Exclusion Principle explain the structure of the periodic table?", type: "Application", answer: "It prevents two identical fermions (like electrons) from occupying the same quantum state simultaneously, forcing electrons into higher energy shells and dictating chemical properties and bonding." }
    ],
    flashcards: [
        { question: "Who proposed the uncertainty principle?", answer: "Werner Heisenberg" },
        { question: "What is a 'quanta'?", answer: "A discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents." },
        { question: "What does the Schrödinger equation describe?", answer: "The evolution of the wave function of a quantum system over time." }
    ]
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Animated Typing Dots Component
const TypingDots = () => {
    const dot1 = useSharedValue(0);
    const dot2 = useSharedValue(0);
    const dot3 = useSharedValue(0);

    React.useEffect(() => {
        const bounce = (sv: any, delay: number) => {
            sv.value = withDelay(
                delay,
                withRepeat(
                    withSequence(
                        withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
                        withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })
                    ),
                    -1,
                    false
                )
            );
        };
        bounce(dot1, 0);
        bounce(dot2, 150);
        bounce(dot3, 300);
    }, []);

    const dotStyle1 = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(dot1.value, [0, 1], [0, -6]) }],
        opacity: interpolate(dot1.value, [0, 1], [0.4, 1]),
    }));
    const dotStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(dot2.value, [0, 1], [0, -6]) }],
        opacity: interpolate(dot2.value, [0, 1], [0.4, 1]),
    }));
    const dotStyle3 = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(dot3.value, [0, 1], [0, -6]) }],
        opacity: interpolate(dot3.value, [0, 1], [0.4, 1]),
    }));

    return (
        <View style={typingDotsStyles.container}>
            <Animated.View style={[typingDotsStyles.dot, dotStyle1]} />
            <Animated.View style={[typingDotsStyles.dot, dotStyle2]} />
            <Animated.View style={[typingDotsStyles.dot, dotStyle3]} />
        </View>
    );
};

const typingDotsStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        gap: 5,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#94A3B8',
    },
});

// Expandable Mastery Card Component
const MasteryCard = ({ q }: { q: any }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity style={styles.masteryTile} onPress={toggleExpand} activeOpacity={0.9}>
            <View style={styles.tileHeader}>
                <View style={[styles.tileBadge, expanded && { backgroundColor: '#E2E8F0' }]}>
                    <Text style={styles.tileBadgeText}>{q.type}</Text>
                </View>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
            </View>
            <Text style={styles.tileText}>{q.question}</Text>

            {expanded && (
                <View style={styles.answerContainer}>
                    <View style={styles.answerDivider} />
                    <Text style={styles.answerLabel}>Answer Insights</Text>
                    <Text style={styles.answerText}>{q.answer}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function RevisionSheetScreen() {
    const { id, topic: searchTopic } = useLocalSearchParams();
    const router = useRouter();
    const [data, setData] = useState<RevisionMaterial | null>(null);
    const [viewMode, setViewMode] = useState<'sheet' | 'flashcards'>('sheet');
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Keyboard handling moved to standard KeyboardAvoidingView in Tab

    // Refs
    const scrollRef = React.useRef<ScrollView>(null);
    const chatScrollRef = React.useRef<ScrollView>(null);
    const chatInputRef = React.useRef<TextInput>(null);

    useEffect(() => {
        const fetchSheet = async () => {
            try {
                const topicToFetch = (searchTopic as string) || "Quantum Mechanics";
                const result = await generateRevisionSheet(topicToFetch);
                setData(result);
            } catch (error) {
                console.error("Failed to generate revision sheet:", error);
            }
        };
        fetchSheet();
    }, [searchTopic]);

    if (!data) return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Synthesizing...</Text>
            </View>
        </SafeAreaView>
    );

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my StudySnap revision sheet on ${data.topic}:\n\n${data.summary}`,
                title: `${data.topic} Study Sheet`
            });
        } catch (error) {
            console.error(error);
        }
    };

    const openChatModal = () => {
        setIsChatOpen(true);
        setTimeout(() => chatInputRef.current?.focus(), 400);
    };

    const closeChatModal = () => {
        setIsChatOpen(false);
    };

    const handleSendChat = async () => {
        if (!chatMessage.trim()) return;

        const userMsg = chatMessage.trim();
        const newHistory = [...chatHistory, { role: 'user' as const, text: userMsg }];

        setChatHistory(newHistory);
        setChatMessage('');
        setIsAiTyping(true);

        setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const responseText = await sendChatMessage(newHistory, userMsg);
            setChatHistory(prev => [...prev, { role: 'ai', text: responseText }]);
            setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
        } catch (error) {
            console.error("Chat error:", error);
            setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I had trouble processing that request." }]);
        } finally {
            setIsAiTyping(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Solid Minimalist Background */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#FFFFFF' }]} />

            {/* Modern Header - Tiempos only here */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Revision Sheet</Text>
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                    <Ionicons name="share-outline" size={22} color="#0F172A" />
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollRef}
                style={styles.sheetContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 80,
                    flexGrow: 1
                }}
            >
                <Animated.View entering={FadeInDown.duration(800).springify()}>
                    <Text style={styles.editorialTopic}>{data.topic}</Text>
                    <Text style={styles.editorialSubtitle} numberOfLines={2}>{data.subtitle}</Text>
                </Animated.View>

                {/* Mode Switcher - Text Only Pill */}
                <View style={styles.modeSwitchContainer}>
                    <TouchableOpacity
                        onPress={() => setViewMode('sheet')}
                        style={styles.modePill}
                    >
                        <Text style={[styles.modePillText, viewMode === 'sheet' && styles.modePillTextActive]}>Overview</Text>
                        {viewMode === 'sheet' && <View style={styles.modeIndicator} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setViewMode('flashcards')}
                        style={styles.modePill}
                    >
                        <Text style={[styles.modePillText, viewMode === 'flashcards' && styles.modePillTextActive]}>Flashcards</Text>
                        {viewMode === 'flashcards' && <View style={styles.modeIndicator} />}
                    </TouchableOpacity>
                </View>

                {viewMode === 'sheet' ? (
                    <>
                        {/* 1. Key Concepts Section - Editorial Cloud */}
                        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}>
                            <View style={styles.editorialSectionHeader}>
                                <Text style={styles.editorialLabel}>Key Concepts</Text>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.cloudContainer}
                            >
                                {data.keyConcepts.map((concept: any, idx: number) => (
                                    <View key={idx} style={[styles.termCloudPill, { backgroundColor: idx % 2 === 0 ? '#F4F4F5' : '#FFFFFF' }]}>
                                        <Text style={styles.termCloudTitle}>{concept.term}</Text>
                                        <MathMarkdown style={termCloudDefMarkdownStyles}>{concept.definition}</MathMarkdown>
                                    </View>
                                ))}
                            </ScrollView>
                        </Animated.View>

                        {/* 2. Detailed Summary */}
                        <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} style={styles.editorialArticle}>
                            <View style={styles.editorialSectionHeader}>
                                <Text style={styles.editorialLabel}>Topic Analysis</Text>
                            </View>
                            <MathMarkdown style={articleMarkdownStyles}>{data.summary}</MathMarkdown>
                        </Animated.View>

                        {/* 3. Study Flow - Pulse Timeline */}
                        <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} style={{ marginTop: 15 }}>
                            <View style={styles.editorialSectionHeader}>
                                <Text style={styles.editorialLabel}>Logic Sequence</Text>
                            </View>
                            <View style={styles.timelineContainer}>
                                {data.flow.map((step: string, idx: number) => (
                                    <View key={idx} style={styles.timelineItem}>
                                        <View style={styles.timelineLeft}>
                                            <View style={styles.timelineDot} />
                                            {idx < data.flow.length - 1 && <View style={styles.timelineLine} />}
                                        </View>
                                        <View style={styles.timelineContent}>
                                            <Text style={styles.timelineText}>{step}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>

                        {/* 4. Mastery Questions - Unified Height Tiles */}
                        <Animated.View entering={FadeInDown.delay(500).duration(800).springify()} style={{ marginTop: 15 }}>
                            <View style={styles.editorialSectionHeader}>
                                <Text style={styles.editorialLabel}>Mastery Check</Text>
                            </View>
                            <View style={styles.masteryList}>
                                {data.examQuestions.map((q: any, idx: number) => (
                                    <MasteryCard key={idx} q={q} />
                                ))}
                            </View>
                        </Animated.View>
                    </>
                ) : (
                    <Animated.View entering={FadeInRight.duration(400)} style={styles.flashcardView}>
                        <FlashcardDeck cards={data.flashcards} />
                    </Animated.View>
                )}
            </ScrollView>

            {/* Floating Chat Trigger Bar */}
            <View style={styles.chatTriggerContainer}>
                <TouchableOpacity style={styles.chatTriggerBar} onPress={openChatModal} activeOpacity={0.8}>
                    <Ionicons name="chatbubble-ellipses-outline" size={18} color="#94A3B8" />
                    <Text style={styles.chatTriggerText}>Ask a follow-up question...</Text>
                    {chatHistory.length > 0 && (
                        <View style={styles.chatBadge}>
                            <Text style={styles.chatBadgeText}>{chatHistory.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Simulated Modal (Absolute View) */}
            {isChatOpen && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}>
                    <Animated.View
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(200)}
                        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                    >
                        <TouchableOpacity style={{ flex: 1 }} onPress={closeChatModal} activeOpacity={1} />
                    </Animated.View>

                    <Animated.View
                        entering={SlideInDown.duration(400).springify().damping(18)}
                        exiting={SlideOutDown.duration(300)}
                        style={styles.simulatedModalSheet}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            style={{ flex: 1 }}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                        >
                            {/* Header */}
                            <View style={styles.modalHeader}>
                                <View style={styles.modalDragHandle} />
                                <View style={styles.modalTitleRow}>
                                    <View style={styles.modalTitleLeft}>
                                        <View style={styles.modalAIIcon}>
                                            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.modalTitle}>AI Tutor</Text>
                                    </View>
                                    <TouchableOpacity onPress={closeChatModal} style={styles.modalCloseBtn}>
                                        <Ionicons name="chevron-down" size={24} color="#64748B" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView
                                ref={chatScrollRef}
                                style={styles.modalChatScroll}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.modalChatContent}
                            >
                                {chatHistory.length === 0 && (
                                    <View style={styles.emptyChat}>
                                        <View style={styles.emptyChatIcon}>
                                            <Ionicons name="chatbubbles-outline" size={32} color="#CBD5E1" />
                                        </View>
                                        <Text style={styles.emptyChatTitle}>Ask anything about {data.topic}</Text>
                                        <Text style={styles.emptyChatSub}>Your AI tutor is ready to help.</Text>
                                    </View>
                                )}

                                {chatHistory.map((msg, idx) => (
                                    <Animated.View
                                        key={idx}
                                        entering={msg.role === 'user' ? FadeInRight : FadeInLeft}
                                        style={[
                                            styles.messageRow,
                                            msg.role === 'user' ? styles.userRow : styles.aiRow
                                        ]}
                                    >
                                        <View style={{ width: '100%', alignItems: msg.role === 'ai' ? 'flex-start' : 'flex-end' }}>
                                            <View style={[
                                                styles.messageContainer,
                                                msg.role === 'user' ? styles.userMessage : styles.aiMessage
                                            ]}>
                                                <MathMarkdown style={modalMarkdownStyles}>
                                                    {msg.text}
                                                </MathMarkdown>
                                            </View>
                                        </View>
                                    </Animated.View>
                                ))}

                                {isAiTyping && (
                                    <View style={styles.typingBox}>
                                        <TypingDots />
                                        <Text style={styles.typingText}>Thinking...</Text>
                                    </View>
                                )}
                            </ScrollView>

                            <View style={styles.modalFooter}>
                                <View style={styles.modalInputDock}>
                                    <View style={styles.modalInputRow}>
                                        <TextInput
                                            ref={chatInputRef}
                                            style={styles.modalInput}
                                            placeholder="Ask a question..."
                                            placeholderTextColor="#94A3B8"
                                            value={chatMessage}
                                            onChangeText={setChatMessage}
                                            onSubmitEditing={handleSendChat}
                                            multiline
                                        />
                                        <TouchableOpacity
                                            onPress={handleSendChat}
                                            disabled={!chatMessage.trim()}
                                            style={[styles.sendCircle, !chatMessage.trim() && styles.sendDisabled]}
                                        >
                                            <Ionicons
                                                name="arrow-up"
                                                size={20}
                                                color={chatMessage.trim() ? 'white' : 'rgba(15, 23, 42, 0.4)'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </Animated.View>
                </View>
            )}
        </SafeAreaView >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        fontFamily: 'FK-Grotesk-Medium',
        color: '#64748B',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    screenTitle: {
        fontFamily: 'Tiempos-Bold',
        fontSize: 18,
        color: '#0F172A',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetContent: {
        flex: 1,
        paddingHorizontal: 24,
    },
    editorialTopic: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 48,
        color: '#0F172A',
        lineHeight: 52,
        letterSpacing: -1.5,
        marginTop: 0,
    },
    editorialSubtitle: {
        fontFamily: 'FK-Grotesk-Medium',
        fontSize: 16,
        color: '#64748B',
        marginTop: 6,
        lineHeight: 24,
    },
    modeSwitchContainer: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 24,
    },
    modePill: {
        paddingVertical: 4,
    },
    modePillText: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 15,
        color: '#94A3B8',
    },
    modePillTextActive: {
        color: '#0F172A',
    },
    modeIndicator: {
        height: 2,
        backgroundColor: '#0F172A',
        marginTop: 4,
        width: '100%',
    },
    editorialSectionHeader: {
        marginTop: 20,
        marginBottom: 8,
    },
    editorialLabel: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 12,
        color: '#3B82F6',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    cloudContainer: {
        paddingRight: 40,
    },
    termCloudPill: {
        width: 240,
        padding: 24,
        borderRadius: 24,
        marginRight: 16,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    termCloudTitle: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 20,
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    termCloudDef: {
        fontFamily: 'FK-Grotesk-Medium',
        fontSize: 14,
        lineHeight: 20,
        color: '#475569',
    },
    editorialArticle: {
        marginTop: 10,
    },
    articleText: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 18,
        lineHeight: 28,
        color: '#1E293B',
    },
    timelineContainer: {
        marginTop: 8,
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: 70,
    },
    timelineLeft: {
        width: 20,
        alignItems: 'center',
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#0F172A',
        marginTop: 8,
    },
    timelineLine: {
        flex: 1,
        width: 1.5,
        backgroundColor: '#E2E8F0',
        marginVertical: 4,
    },
    timelineContent: {
        flex: 1,
        paddingLeft: 20,
        paddingBottom: 16,
    },
    timelineText: {
        fontFamily: 'FK-Grotesk-Medium',
        fontSize: 16,
        color: '#0F172A',
        lineHeight: 24,
    },
    masteryList: {
        flexDirection: 'column',
    },
    masteryTile: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        marginBottom: 12,
    },
    tileBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#F4F4F5',
        borderRadius: 6,
    },
    tileBadgeText: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 10,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tileText: {
        fontFamily: 'FK-Grotesk-Medium',
        fontSize: 16,
        color: '#0F172A',
        lineHeight: 24,
    },
    answerContainer: {
        marginTop: 16,
    },
    answerDivider: {
        height: 1.5,
        backgroundColor: '#F1F5F9',
        marginBottom: 12,
        width: '100%',
    },
    answerLabel: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 12,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    answerText: {
        fontFamily: 'Tiempos-Medium',
        fontSize: 16,
        color: '#334155',
        lineHeight: 24,
    },
    flashcardView: {
        width: '100%',
    },
    // Floating Chat Trigger
    chatTriggerContainer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 12,
        backgroundColor: '#FFFFFF',
    },
    chatTriggerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    chatTriggerText: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'FK-Grotesk-Medium',
        color: '#94A3B8',
        marginLeft: 10,
    },
    chatBadge: {
        backgroundColor: '#0F172A',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    chatBadgeText: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 11,
        color: '#FFFFFF',
    },
    // Modal Overlay & Sheet
    simulatedModalSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SIMULATED_MODAL_HEIGHT,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: 'hidden',
        zIndex: 1001,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalDismissArea: {
        flex: 1,
    },
    modalSheet: {
        flex: 1, // Full take in tab mode
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    modalHeader: {
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        alignItems: 'center',
    },
    modalDragHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E2E8F0',
        marginBottom: 16,
    },
    modalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalTitleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalAIIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    modalTitle: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 17,
        color: '#0F172A',
    },
    modalCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Tab Chat Styles
    tabChatScroll: {
        flex: 1,
    },
    tabChatContent: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 20,
        flexGrow: 1,
    },
    tabFooter: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 10 : 10,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    // Chat Messages - matching chat.tsx
    modalChatScroll: {
        flex: 1,
    },
    modalChatContent: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 20,
        flexGrow: 1,
    },
    emptyChat: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyChatIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyChatTitle: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 17,
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyChatSub: {
        fontFamily: 'FK-Grotesk-Medium',
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
    },
    // Message layout - identical to chat.tsx
    messageRow: {
        marginBottom: 24,
        maxWidth: '90%',
    },
    aiRow: {
        alignSelf: 'flex-start',
    },
    userRow: {
        alignSelf: 'flex-end',
    },
    messageContainer: {
        flexDirection: 'column',
        width: '100%',
    },
    aiMessage: {
        backgroundColor: 'transparent',
    },
    userMessage: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        borderBottomRightRadius: 4,
    },
    typingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 4,
        paddingTop: 5,
    },
    typingText: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 13,
        color: '#94A3B8',
        fontStyle: 'italic',
    },
    // Modal Input - matching chat.tsx input dock
    modalFooter: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    modalInputDock: {
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
    },
    modalInputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    modalInput: {
        flex: 1,
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 16,
        color: '#0F172A',
        paddingHorizontal: 10,
        maxHeight: 120,
    },
    sendCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendDisabled: {
        backgroundColor: 'rgba(15, 23, 42, 0.05)',
    },
});

// Markdown styles - matching chat.tsx
const modalMarkdownStyles = StyleSheet.create({
    body: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: '#0F172A',
    },
    heading1: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 24,
        marginTop: 12,
        marginBottom: 8,
        color: '#0F172A',
    },
    heading2: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 8,
        color: '#0F172A',
    },
    heading3: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 18,
        marginTop: 8,
        marginBottom: 6,
        color: '#0F172A',
    },
    strong: {
        fontFamily: 'FK-Grotesk-Bold',
        color: '#0F172A',
    },
    em: {
        fontFamily: 'FK-Grotesk-Italic',
        color: '#0F172A',
    },
    paragraph: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 0,
        marginBottom: 0,
        color: '#0F172A',
    },
    list_item: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: '#0F172A',
    },
    bullet_list: {
        marginTop: 4,
        marginBottom: 4,
    },
    ordered_list: {
        marginTop: 4,
        marginBottom: 4,
    },
});

const articleMarkdownStyles = StyleSheet.create({
    body: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 18,
        lineHeight: 28,
        color: '#1E293B',
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 0,
    }
});

const termCloudDefMarkdownStyles = StyleSheet.create({
    body: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 0,
    }
});
