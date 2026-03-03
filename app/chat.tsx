import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import Animated, {
    FadeInDown,
    Layout,
    FadeIn,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    ZoomIn,
    ZoomOut
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenAI } from '@google/genai';
import { File } from 'expo-file-system';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp?: Date;
    imageUri?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const OPTIONS = [
    { label: "Summarize", icon: "document-text-outline" },
    { label: "Create Quiz", icon: "school-outline" },
    { label: "Explain", icon: "bulb-outline" },
    { label: "Flashcards", icon: "layers-outline" },
];

const ShimmerTitle = () => {
    const shimmerProgress = useSharedValue(0);

    React.useEffect(() => {
        shimmerProgress.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(shimmerProgress.value, [0, 1], [-150, 150]);
        return {
            transform: [{ translateX }],
        };
    });

    return (
        <View style={styles.shimmerWrapper}>
            <MaskedView
                maskElement={
                    <View style={styles.maskContainer}>
                        <Text style={styles.headerTitle}>Snap AI</Text>
                    </View>
                }
            >
                <Text style={styles.headerTitle}>Snap AI</Text>
                <AnimatedView style={[styles.shimmerEffect, animatedStyle]}>
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.8)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                    />
                </AnimatedView>
            </MaskedView>
        </View>
    );
};

// Initialize Gemini API
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const client = new GoogleGenAI({ apiKey: API_KEY });

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome back. I've analyzed your recent notes on cellular biology. Ready to dive deeper into the mitochondria's role in ATP production?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const uriToBase64 = async (uri: string) => {
        const file = new File(uri);
        const base64 = await file.base64();
        return base64;
    };

    const callGeminiApi = async (userMessage: string, imageUri: string | null) => {
        setIsTyping(true);
        try {
            let contents: any;

            if (imageUri) {
                const base64 = await uriToBase64(imageUri);
                contents = [
                    {
                        parts: [
                            { text: userMessage || "Analyze this image" },
                            {
                                inlineData: {
                                    mimeType: 'image/jpeg',
                                    data: base64,
                                },
                            },
                        ],
                    },
                ];
            } else {
                contents = userMessage;
            }

            const result = await client.models.generateContent({
                model: 'gemini-2.5-flash-lite',
                contents,
            });

            const text = result.text;

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: text || "I'm sorry, I couldn't process that.",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("GenAI API error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Oops! Something went wrong. Please check your connection and try again.",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = (text: string = inputText) => {
        if (!text.trim() && !selectedImage) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            sender: 'user',
            timestamp: new Date(),
            imageUri: selectedImage || undefined,
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setSelectedImage(null); // Clear selected image after sending

        callGeminiApi(text.trim(), selectedImage);
    };

    const pickImage = async () => {
        // Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isAI = item.sender === 'ai';
        return (
            <AnimatedView
                entering={FadeInDown.duration(400).springify()}
                layout={Layout.springify()}
                style={[
                    styles.messageRow,
                    isAI ? styles.aiRow : styles.userRow
                ]}
            >
                <View style={{ width: '100%', alignItems: isAI ? 'flex-start' : 'flex-end' }}>
                    {item.imageUri && (
                        <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
                    )}
                    <View style={[
                        styles.messageContainer,
                        item.sender === 'user' ? styles.userMessage : styles.aiMessage,
                        { marginTop: item.imageUri ? 5 : 0 }
                    ]}>
                        <Markdown style={markdownStyles}>
                            {item.text}
                        </Markdown>
                    </View>
                </View>
            </AnimatedView>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
            >
                {/* Modern Glass Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <ShimmerTitle />
                    </View>
                    <TouchableOpacity style={styles.profileBtn}>
                        <View style={styles.pCircle}>
                            <Ionicons name="person-outline" size={18} color="#0F172A" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Main Chat Feed */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListFooterComponent={() => isTyping && (
                        <AnimatedView entering={FadeIn} style={styles.typingBox}>
                            <Text style={styles.typingText}>Thinking through your notes...</Text>
                        </AnimatedView>
                    )}
                />

                {/* Footer Interaction Area */}
                <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.optionsScroll}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {OPTIONS.map((opt, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.optionPill}
                                onPress={() => handleSend(opt.label)}
                            >
                                <Ionicons name={opt.icon as any} size={14} color="#64748B" style={{ marginRight: 6 }} />
                                <Text style={styles.optionLabel}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.inputArea}>
                        <View style={styles.inputDock}>
                            {selectedImage && (
                                <Animated.View
                                    entering={ZoomIn}
                                    exiting={ZoomOut}
                                    style={styles.imagePreviewContainer}
                                >
                                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                                    <TouchableOpacity
                                        style={styles.removeImageBtn}
                                        onPress={() => setSelectedImage(null)}
                                    >
                                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </Animated.View>
                            )}
                            <View style={styles.inputRow}>
                                <TouchableOpacity style={styles.attachBtn} onPress={pickImage}>
                                    <Ionicons name="add" size={24} color="#64748B" />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Whisper a question..."
                                    placeholderTextColor="#94A3B8"
                                    value={inputText}
                                    onChangeText={setInputText}
                                    multiline
                                />
                                <TouchableOpacity
                                    onPress={() => handleSend()}
                                    disabled={!inputText.trim() && !selectedImage}
                                    style={[styles.sendCircle, (!inputText.trim() && !selectedImage) && styles.sendDisabled]}
                                >
                                    <Ionicons
                                        name="arrow-up"
                                        size={20}
                                        color={(inputText.trim() || selectedImage) ? "white" : "rgba(15, 23, 42, 0.4)"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Tiempos-Medium',
        fontSize: 25,
        color: '#0F172A',
        letterSpacing: -0.3,
    },
    shimmerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    maskContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shimmerEffect: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 120,
    },
    profileBtn: {
        padding: 2,
    },
    pCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    chatList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 15,
    },
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
    bubble: {
        paddingVertical: 8,
    },
    aiBubble: {
        backgroundColor: 'transparent',
    },
    userBubble: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 16,
        lineHeight: 24,
    },
    aiText: {
        fontFamily: 'FK-Grotesk-Regular',
        color: '#0F172A',
        fontSize: 16,
        lineHeight: 24,
    },
    userText: {
        fontFamily: 'FK-Grotesk-Regular',
        color: '#1E293B',
        fontSize: 16,
        lineHeight: 24,
    },
    typingBox: {
        paddingLeft: 4,
        paddingTop: 5,
    },
    typingText: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 13,
        color: '#94A3B8',
        fontStyle: 'italic',
    },
    footer: {
        backgroundColor: 'white',
        paddingTop: 10,
    },
    optionsScroll: {
        maxHeight: 40,
        marginBottom: 16,
    },
    optionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 24,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    optionLabel: {
        fontFamily: 'FK-Grotesk-Regular',
        fontSize: 12,
        color: '#64748B',
    },
    inputArea: {
        paddingHorizontal: 16,
    },
    inputDock: {
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
        borderRadius: 24,
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
    },
    imageAction: {
        padding: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    attachBtn: {
        padding: 8,
        marginRight: 4,
    },
    imagePreviewContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 6,
        left: 86,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    messageImage: {
        width: 240,
        height: 180,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
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
    input: {
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

const markdownStyles = StyleSheet.create({
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
