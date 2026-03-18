import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-native-markdown-display';
import { getGeminiResponse } from '../lib/gemini';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, {
    FadeInUp,
    FadeInDown,
    ZoomIn,
    Layout,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Shimmer, ShimmerProvider } from 'react-native-fast-shimmer';
import { Easing } from 'react-native-reanimated';

const ACCENT_COLOR = '#7C3AED';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

// Capability chips per course
const CAPABILITIES: Record<string, { icon: string; title: string; desc: string }[]> = {
    default: [
        { icon: 'document-text-outline', title: 'Notes & Revision', desc: 'Generate short notes and revise chapters quickly' },
        { icon: 'list-outline', title: 'MCQs & Practice', desc: 'Ask MCQs with step-by-step explanations' },
        { icon: 'calculator-outline', title: 'Numerical Solver', desc: 'Solve physics, maths & chemistry numericals' },
        { icon: 'bulb-outline', title: 'Smart Recommendations', desc: 'Get AI-based study and revision suggestions' },
    ],
};

const ThinkingIndicator = () => {
    const opacity = useSharedValue(0.4);
    useEffect(() => {
        opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
    }, []);
    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
    return (
        <View style={styles.thinkingRow}>
            <View style={styles.thinkingDot} />
            <Animated.Text style={[styles.thinkingText, animStyle]}>Thinking…</Animated.Text>
        </View>
    );
};

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { courseName, greetMessage } = useLocalSearchParams<{ courseName?: string; greetMessage?: string }>();

    const resolvedGreet = greetMessage || `Hi there! 👋 I'm your TutorXpert AI tutor for **${courseName || 'this subject'}**. Ask me anything — concepts, examples, MCQs, or numericals!`;

    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', text: resolvedGreet, sender: 'ai' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async (text?: string) => {
        const textToSend = text ?? inputText;
        if (!textToSend.trim() || isTyping) return;

        setChatStarted(true);
        const userMsg: Message = { id: Date.now().toString(), text: textToSend.trim(), sender: 'user' };
        
        // Prepare history for Gemini, excluding the initial welcome greeting
        const history = messages
            .filter(m => m.id !== 'welcome')
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'model' as "user" | "model",
                parts: [{ text: m.text }]
            }));

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const aiText = await getGeminiResponse(textToSend.trim(), history);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Gemini Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "My apologies, I'm having trouble connecting to my knowledge base. Please try again in a moment.",
                sender: 'ai',
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    const caps = CAPABILITIES.default;

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isUser = item.sender === 'user';
        return (
            <Animated.View
                entering={FadeInUp.delay(index * 30)}
                layout={Layout.springify()}
                style={isUser ? styles.userMsgContainer : styles.aiMsgContainer}
            >
                {isUser ? (
                    <LinearGradient colors={['#F8FAFC', '#EFF3F8']} style={styles.userBubble}>
                        <Text style={styles.userText}>{item.text}</Text>
                    </LinearGradient>
                ) : (
                    <View style={styles.aiBubble}>
                        <Markdown style={markdownStyles}>{item.text}</Markdown>
                    </View>
                )}
            </Animated.View>
        );
    };

    return (
        <ShimmerProvider duration={2500}>
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <StatusBar style="dark" />

                <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                    >
                        {/* Header */}
                        <Animated.View entering={FadeInDown.delay(0).duration(600)} style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                                <Ionicons name="chevron-back" size={22} color="#0F172A" />
                            </TouchableOpacity>

                            <View style={styles.titleContainer}>
                                <Text style={styles.headerTitle}>TutorXpert</Text>
                                <Shimmer
                                    style={styles.headerShimmer}
                                    easing={Easing.linear}
                                    linearGradients={['transparent', '#ffffff99', 'transparent']}
                                />
                            </View>

                            <View style={styles.headerActions}>
                                <TouchableOpacity style={styles.iconBtn}>
                                    <Ionicons name="add" size={24} color="#0F172A" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconBtn}>
                                    <Feather name="user" size={18} color="#0F172A" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        {/* Body */}
                        {!chatStarted ? (
                            <Animated.ScrollView
                                entering={FadeInUp.delay(50).duration(600)}
                                contentContainerStyle={styles.promptContent}
                                showsVerticalScrollIndicator={false}
                            >
                                <Text style={styles.promptHeading}>
                                    TutorXpert can help you with
                                </Text>
                                <View style={styles.capsGrid}>
                                    {caps.map((cap, i) => (
                                        <Animated.View
                                            key={cap.title}
                                            entering={ZoomIn.delay(i * 100 + 100).duration(500)}
                                            style={{ width: '100%' }}
                                        >
                                            <TouchableOpacity
                                                style={styles.capCard}
                                                activeOpacity={0.7}
                                                onPress={() => handleSend(`Help me with ${cap.title} for ${courseName}`)}
                                            >
                                                <View style={styles.capIcon}>
                                                    <Ionicons name={cap.icon as any} size={22} color={ACCENT_COLOR} />
                                                </View>
                                                <View style={styles.capTextBlock}>
                                                    <Text style={styles.capTitle}>{cap.title}</Text>
                                                    <Text style={styles.capDesc}>{cap.desc}</Text>
                                                </View>
                                                <View style={styles.capArrow}>
                                                    <Ionicons name="arrow-forward-outline" size={16} color={ACCENT_COLOR} />
                                                </View>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    ))}
                                </View>
                            </Animated.ScrollView>
                        ) : (
                            <FlatList
                                ref={flatListRef}
                                data={messages}
                                keyExtractor={item => item.id}
                                renderItem={renderMessage}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                                ListFooterComponent={
                                    isTyping ? (
                                        <Animated.View entering={FadeInUp.duration(400)}>
                                            <ThinkingIndicator />
                                        </Animated.View>
                                    ) : null
                                }
                            />
                        )}

                        {/* Input Bar */}
                        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Type your question..."
                                    placeholderTextColor="#94A3B8"
                                    value={inputText}
                                    onChangeText={setInputText}
                                    multiline
                                    maxLength={500}
                                    onSubmitEditing={() => handleSend()}
                                    returnKeyType="send"
                                    blurOnSubmit
                                />
                                <View style={styles.inputActions}>
                                    <TouchableOpacity style={[styles.iconBtn, styles.inputActionBtn]}>
                                        <Ionicons name="add" size={24} color="#94A3B8" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                                        onPress={() => handleSend()}
                                        disabled={!inputText.trim() || isTyping}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name="arrow-forward"
                                            size={18}
                                            color={inputText.trim() ? '#FFF' : '#94A3B8'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </ShimmerProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
    },
    titleContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Tiempos-Headline',
        color: '#000000',
    },
    headerShimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    promptContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 140,
    },
    promptHeading: {
        fontSize: 22,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
        marginBottom: 20,
        lineHeight: 30,
    },
    capsGrid: {
        gap: 12,
    },
    capCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
    },
    capIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#7C3AED0F', // 6% opacity
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    capTextBlock: {
        flex: 1,
    },
    capTitle: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Medium',
        color: '#0F172A',
        marginBottom: 4,
    },
    capDesc: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Regular',
        color: '#64748B',
        lineHeight: 18,
    },
    capArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#7C3AED0D', // 5% opacity
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 140,
    },
    userMsgContainer: {
        alignItems: 'flex-end',
        marginVertical: 8,
    },
    aiMsgContainer: {
        alignItems: 'flex-start',
        marginVertical: 8,
        paddingRight: 20,
    },
    userBubble: {
        maxWidth: '82%',
        paddingHorizontal: 18,
        paddingVertical: 13,
        borderRadius: 22,
        borderBottomRightRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    aiBubble: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 18,
        paddingVertical: 13,
        borderRadius: 22,
        borderTopLeftRadius: 6,
    },
    userText: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: '#334155',
        lineHeight: 22,
    },
    aiText: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: '#0F172A',
        lineHeight: 24,
    },
    thinkingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    thinkingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ACCENT_COLOR,
        opacity: 0.5,
    },
    thinkingText: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Regular',
        color: '#94A3B8',
        fontStyle: 'italic',
    },
    inputWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 28 : 20,
        paddingTop: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 28,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: 56,
        maxHeight: 120,
    },
    inputActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inputActionBtn: {
        width: 38,
        height: 38,
        backgroundColor: '#FFFFFF',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#0F172A',
        paddingVertical: 8,
        paddingRight: 12,
        lineHeight: 22,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: ACCENT_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    sendBtnDisabled: {
        backgroundColor: '#EFF3F8',
    },
});

const markdownStyles = StyleSheet.create({
    body: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: '#0F172A',
        lineHeight: 24,
    },
    strong: {
        fontFamily: 'FKGrotesk-Medium',
        fontWeight: 'bold',
    },
    em: {
        fontStyle: 'italic',
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 8,
    },
    bullet_list: {
        marginVertical: 4,
    },
    ordered_list: {
        marginVertical: 4,
    },
    list_item: {
        marginVertical: 2,
    },
    code_inline: {
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        paddingHorizontal: 4,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
});
