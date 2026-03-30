import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Platform,
    Image,
    Alert,
    Modal,
    Pressable,
    Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { MathMarkdownRenderer } from '../components/MathMarkdownRenderer';
import Animated, {
    FadeInUp,
    FadeInDown,
    FadeOutDown,
    Layout,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    interpolate,
    useAnimatedProps
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleGenAI } from '@google/genai';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- CONFIGURATION ---
const API_KEY = 'PASTE_YOUR_GEMINI_API_KEY_HERE';
const genAI = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || API_KEY });
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

// --- HELPERS ---
const fileToPart = async (uri: string, mimeType: string) => {
    try {
        const file = new File(uri);
        const base64Data = await file.base64();
        return {
            inlineData: {
                data: base64Data,
                mimeType
            }
        };
    } catch (err) {
        console.error('[StudySnap] File to Part Error:', err);
        return null;
    }
};

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    image?: string;
    file?: { name: string, uri: string };
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        zIndex: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    titleContainer: {
        position: 'relative',
        overflow: 'hidden',
    },
    shimmerGradient: {
        flex: 1,
        width: 100,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    userIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    thinkingWrapper: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    thinkingText: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Regular',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    headerTitle: {
        fontSize: 25,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    userMessageContainer: {
        alignItems: 'flex-end',
        marginVertical: 12,
    },
    userBubble: {
        maxWidth: '85%',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 24,
        borderBottomRightRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    userText: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#334155',
        lineHeight: 24,
    },
    aiMessageContainer: {
        alignItems: 'flex-start',
        marginVertical: 12,
        paddingRight: 10,
    },
    aiText: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#0F172A',
        lineHeight: 28,
    },
    typingContainer: {
        paddingVertical: 10,
        alignItems: 'flex-start',
    },
    inputWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 20,
        paddingTop: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#FCFDFF',
        borderRadius: 28,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: 56,
        maxHeight: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#0F172A',
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 12,
        lineHeight: 22,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    sendButtonDisabled: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    messageImage: {
        width: 180,
        height: 180,
        borderRadius: 20,
        marginBottom: 8,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    previewWrapper: {
        paddingBottom: 8,
        paddingHorizontal: 4,
        alignSelf: 'flex-start',
        zIndex: 100,
        elevation: 5,
    },
    previewContainer: {
        width: 70,
        height: 70,
        borderRadius: 14,
        overflow: 'visible',
        position: 'relative',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 20,
    },
    attachButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
        marginBottom: 2,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        paddingTop: 16,
        paddingHorizontal: 16,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 25,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'FKGrotesk-Bold',
        color: '#0F172A',
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    gridOption: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    gridIconContainer: {
        marginBottom: 8,
    },
    gridOptionText: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Regular',
        color: '#64748B',
    },
    filePreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 12,
        width: 220,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        position: 'relative',
    },
    fileIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    fileInfoBox: {
        flex: 1,
        justifyContent: 'center',
    },
    filePreviewName: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Bold',
        color: '#1E293B',
        marginBottom: 2,
    },
    filePreviewSize: {
        fontSize: 12,
        fontFamily: 'FKGrotesk-Regular',
        color: '#64748B',
    },
    removeFileButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 20,
    },
    messageFileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        maxWidth: '85%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-start',
    },
    messageFileName: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Regular',
        color: '#334155',
        marginLeft: 8,
        flexShrink: 1,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginLeft: 4,
        alignItems: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#94A3B8',
        marginHorizontal: 1.5,
    },
});

const INITIAL_MESSAGES: Message[] = [
    {
        id: 'welcome',
        text: "Hi there! 👋 I'm your StudySnap AI. I can help you summarize notes, explain complex topics, or prepare for exams. What are we working on today?",
        sender: 'ai',
    }
];


const ThinkingIndicator = () => {
    const dot1 = useSharedValue(0.3);
    const dot2 = useSharedValue(0.3);
    const dot3 = useSharedValue(0.3);

    useEffect(() => {
        dot1.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
        dot2.value = withRepeat(withDelay(200, withTiming(1, { duration: 600 })), -1, true);
        dot3.value = withRepeat(withDelay(400, withTiming(1, { duration: 600 })), -1, true);
    }, []);

    const dotStyle1 = useAnimatedStyle(() => ({ opacity: dot1.value, transform: [{ scale: interpolate(dot1.value, [0.3, 1], [0.8, 1.2]) }] }));
    const dotStyle2 = useAnimatedStyle(() => ({ opacity: dot2.value, transform: [{ scale: interpolate(dot2.value, [0.3, 1], [0.8, 1.2]) }] }));
    const dotStyle3 = useAnimatedStyle(() => ({ opacity: dot3.value, transform: [{ scale: interpolate(dot3.value, [0.3, 1], [0.8, 1.2]) }] }));

    return (
        <View style={styles.thinkingWrapper}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.thinkingText}>Preparing</Text>
                <View style={styles.dotsContainer}>
                    <Animated.View style={[styles.dot, dotStyle1]} />
                    <Animated.View style={[styles.dot, dotStyle2]} />
                    <Animated.View style={[styles.dot, dotStyle3]} />
                </View>
            </View>
        </View>
    );
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as any;

export default function ChatScreen() {
    console.log('[StudySnap] ChatScreen v1.3 Initializing');
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { initialQuestion } = useLocalSearchParams<{ initialQuestion?: string }>();

    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState<{ uri: string, base64?: string | null } | null>(null);
    const [selectedFile, setSelectedFile] = useState<{ name: string, uri: string, base64?: string, size?: number, mimeType?: string } | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const flatListRef = useRef<any>(null);

    const { height } = useReanimatedKeyboardAnimation();

    const inputAnimatedStyle = useAnimatedStyle(() => ({
        paddingBottom: Math.abs(height.value) + (Math.abs(height.value) > 0 ? 8 : (Platform.OS === 'ios' ? 24 : 20))
    }));

    const listAnimatedProps = useAnimatedProps(() => ({
        contentContainerStyle: {
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 140 + Math.abs(height.value)
        }
    }));

    // Header Shimmer Animation
    const shimmerValue = useSharedValue(0);
    useEffect(() => {
        shimmerValue.value = withRepeat(
            withTiming(1, { duration: 2500 }),
            -1,
            false
        );
    }, []);

    // Handle initial question from navigation
    useEffect(() => {
        if (initialQuestion && initialQuestion.trim() !== '') {
            setTimeout(() => {
                handleSend(initialQuestion);
            }, 500);
        }
    }, [initialQuestion]);

    const shimmerStyle = useAnimatedStyle(() => {
        const translateX = interpolate(shimmerValue.value, [0, 1], [-150, 150]);
        return { transform: [{ translateX }] };
    });

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need gallery access to pick images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled) {
            setSelectedImage({
                uri: result.assets[0].uri,
                base64: result.assets[0].base64
            });
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera access to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled) {
            setSelectedImage({
                uri: result.assets[0].uri,
                base64: result.assets[0].base64
            });
            setSelectedFile(null); // Clear file if image is picked
        }
    };

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                const file = new File(asset.uri);
                const base64Data = await file.base64();

                setSelectedFile({
                    name: asset.name,
                    uri: asset.uri,
                    base64: base64Data,
                    size: asset.size || 0,
                    mimeType: asset.mimeType || 'application/octet-stream'
                });
                setSelectedImage(null); // Clear image if file is picked
            }
        } catch (err) {
            console.error('File Pick Error:', err);
        }
    };

    const handleImagePress = () => {
        setIsImageModalVisible(true);
    };

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || inputText;
        if ((!textToSend.trim() && !selectedImage && !selectedFile) || isTyping) return;

        const userText = textToSend.trim();
        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            image: selectedImage?.uri || undefined,
            file: selectedFile ? { name: selectedFile.name, uri: selectedFile.uri } : undefined
        };

        const currentImage = selectedImage;
        const currentFile = selectedFile;
        console.log('[StudySnap] Sending message. Image:', currentImage?.uri ? 'Yes' : 'No', 'File:', currentFile?.name || 'No');
        setMessages((prev: Message[]) => [...prev, newUserMsg]);
        setInputText('');
        setSelectedImage(null);
        setSelectedFile(null);
        setIsTyping(true);

        // Auto-scroll logic
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const contentParts: any[] = [];

            // Text Part
            let promptText = userText || (currentImage ? "Analyze this image." : "Analyze this file.");
            contentParts.push({ text: promptText });

            // Handle Image - use inlineData for mobile
            if (currentImage?.base64) {
                contentParts.push({
                    inlineData: {
                        data: currentImage.base64,
                        mimeType: 'image/jpeg'
                    }
                });
            }

            // Handle File - Attempt GenAI Files API or Fallback to inlineData
            if (currentFile?.uri) {
                let fileProcessed = false;

                // Try GenAI File Manager if available (for larger files)
                try {
                    console.log('[StudySnap] Attempting GenAI File API upload...');
                    // In React Native, we can't easily use the formal Files API without polyfills
                    // So we check if the SDK supports it and if we have a valid platform Blob
                    if ((genAI as any).files) {
                        const filePart = await fileToPart(currentFile.uri, currentFile.mimeType || 'application/pdf');
                        if (filePart) {
                            contentParts.push(filePart);
                            fileProcessed = true;
                            console.log('[StudySnap] File processed via inlineData (fallback for reliability)');
                        }
                    }
                } catch (apiErr) {
                    console.warn('[StudySnap] General File API attempt failed:', apiErr);
                }

                // Reliability Fallback: Ensure inlineData is used if File API failed
                if (!fileProcessed && currentFile.base64) {
                    contentParts.push({
                        inlineData: {
                            data: currentFile.base64,
                            mimeType: currentFile.mimeType || 'application/pdf'
                        }
                    });
                    fileProcessed = true;
                }
            }

            console.log('[StudySnap] Initializing Gemini Model:', GEMINI_MODEL);

            // In @google/genai v1.45.0, we use genAI.models.generateContent directly
            const result = await (genAI as any).models.generateContent({
                model: GEMINI_MODEL,
                contents: [{ role: 'user', parts: contentParts }],
                systemInstruction: `You are StudySnap AI, a professional and friendly study assistant. Explain concepts clearly with examples.
                    
CRITICAL FORMATTING RULES (follow exactly):
- Use standard Markdown for text: **bold**, *italic*, headings (##, ###), bullet lists (- item), numbered lists (1. item).
- For ALL math, you MUST wrap it in dollar signs. Inline math: $expression$. Display/block math: $$expression$$.
- NEVER write raw LaTeX commands outside dollar signs. NEVER write \\sqrt{2} without wrapping it like $\\sqrt{2}$.
- If using the Indian Rupee symbol (₹), ALWAYS keep it OUTSIDE of LaTeX blocks as plain text (e.g., Rs. 500 or Rs.500). NEVER use the ₹ character.
- **CRITICAL**: DO NOT write extremely long, single-line math equations. Break long calculations into multiple short lines using separate $$ blocks. Each line should be ONE step only.
- **BANNED COMMANDS** (NEVER use these — they will cause errors): \\multicolumn, \\cline, \\hline, \\toprule, \\midrule, \\bottomrule, \\newline, \\arraystretch, \\begin{tabular}, \\end{tabular}. Use simple aligned $$ equations instead of tables for math.
- For step-by-step solutions, use plain text labels like **Step 1:**, **Step 2:** with each math step on its own $$ line.
- If a file is provided, analyze its contents thoroughly to answer the user's prompt (summary, key points, etc).
- Examples of CORRECT formatting:
  - Inline: "the value of $\\sqrt{2}$ is irrational"
  - Inline: "where $p$ and $q$ are integers and $q \\neq 0$"
  - Block: $$\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b$$`
            });

            if (!result) {
                throw new Error('No response from Gemini API');
            }

            // In this SDK, text is a getter on the response object
            const aiText = result.text || "I'm sorry, I couldn't generate a text response.";

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai'
            };
            setMessages((prev: Message[]) => [...prev, aiResponse]);
        } catch (error: any) {
            console.error('Gemini Error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 2).toString(),
                text: `Sorry, I encountered an error: ${error.message || 'Please check your connection.'}`,
                sender: 'ai'
            };
            setMessages((prev: Message[]) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    const handleNewChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                text: "Starting fresh! 📚 What study topic should we tackle next?",
                sender: 'ai',
            }
        ]);
    };

    const renderMessage = ({ item, index }: { item: Message, index: number }) => {
        const isUser = item.sender === 'user';
        if (isUser) {
            return (
                <Animated.View
                    entering={FadeInUp.delay(index * 50).springify()}
                    layout={Layout.springify()}
                    style={styles.userMessageContainer}
                >
                    {item.image && (
                        <Image source={{ uri: item.image }} style={styles.messageImage} />
                    )}
                    {item.file && (
                        <View style={styles.messageFileContainer}>
                            <Feather name="file-text" size={20} color="#64748B" />
                            <Text style={styles.messageFileName} numberOfLines={1}>{item.file.name}</Text>
                        </View>
                    )}
                    <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.userBubble}>
                        <Text style={styles.userText}>{item.text}</Text>
                    </LinearGradient>
                </Animated.View>
            );
        } else {
            return (
                <Animated.View
                    entering={FadeInUp.delay(index * 50).springify()}
                    layout={Layout.springify()}
                    style={styles.aiMessageContainer}
                >
                    <MathMarkdownRenderer content={item.text} fontSize={16} />
                </Animated.View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="chevron-back" size={24} color="#0F172A" />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>StudySnap Ai</Text>
                        <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle, { overflow: 'hidden' }]}>
                            <LinearGradient
                                colors={['transparent', 'rgba(255, 255, 255, 0.6)', 'transparent']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.shimmerGradient}
                            />
                        </Animated.View>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={handleNewChat} style={styles.iconButton}>
                            <Ionicons name="add" size={24} color="#0F172A" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.userIconContainer}>
                            <Feather name="user" size={18} color="#0F172A" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Messages List */}
                <AnimatedFlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item: any) => item.id}
                    renderItem={renderMessage}
                    animatedProps={listAnimatedProps}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        isTyping ? (
                            <Animated.View entering={FadeInUp.springify()} style={styles.typingContainer}>
                                <ThinkingIndicator />
                            </Animated.View>
                        ) : null
                    }
                />

                {/* Input Area */}
                <Animated.View style={[styles.inputWrapper, inputAnimatedStyle]}>
                    {selectedImage ? (
                        <View style={styles.previewWrapper}>
                            <View style={styles.previewContainer}>
                                <Image
                                    key={selectedImage.uri}
                                    source={{ uri: selectedImage.uri }}
                                    style={styles.previewImage}
                                />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => setSelectedImage(null)}
                                >
                                    <Ionicons name="close-circle" size={24} color="#0F172A" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}

                    {selectedFile ? (
                        <View style={styles.previewWrapper}>
                            <View style={styles.filePreviewContainer}>
                                <View style={styles.fileIconBox}>
                                    <Feather name="file-text" size={24} color="#64748B" />
                                </View>
                                <View style={styles.fileInfoBox}>
                                    <Text style={styles.filePreviewName} numberOfLines={1}>
                                        {selectedFile.name}
                                    </Text>
                                    <Text style={styles.filePreviewSize}>
                                        {(selectedFile.size ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0')} MB
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeFileButton}
                                    onPress={() => setSelectedFile(null)}
                                >
                                    <Ionicons name="close-circle" size={24} color="#0F172A" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            style={styles.attachButton}
                            onPress={handleImagePress}
                        >
                            <Ionicons name="add" size={24} color="#64748B" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ask follow-up questions..."
                            placeholderTextColor="#94A3B8"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled
                            ]}
                            onPress={() => handleSend()}
                            disabled={(!inputText.trim() && !selectedImage) || isTyping}
                        >
                            {isTyping ? (
                                <Feather name="loader" size={18} color="#94A3B8" />
                            ) : (
                                <Ionicons name="arrow-up" size={20} color={(!inputText.trim() && !selectedImage) ? "#94A3B8" : "#FFFFFF"} />
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Custom Image Picker Modal */}
                <Modal
                    visible={isImageModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsImageModalVisible(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setIsImageModalVisible(false)}
                    >
                        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                        <Animated.View
                            entering={FadeInUp.duration(300)}
                            exiting={FadeOutDown.duration(300)}
                            style={styles.modalContent}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Options</Text>
                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setIsImageModalVisible(false)}
                                >
                                    <Ionicons name="close" size={20} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalOptionsRow}>
                                <TouchableOpacity
                                    style={styles.gridOption}
                                    onPress={() => {
                                        setIsImageModalVisible(false);
                                        setTimeout(pickImage, 300);
                                    }}
                                >
                                    <View style={styles.gridIconContainer}>
                                        <Feather name="image" size={24} color="#0F172A" />
                                    </View>
                                    <Text style={styles.gridOptionText}>Image</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.gridOption}
                                    onPress={() => {
                                        setIsImageModalVisible(false);
                                        setTimeout(takePhoto, 300);
                                    }}
                                >
                                    <View style={styles.gridIconContainer}>
                                        <Feather name="camera" size={24} color="#0F172A" />
                                    </View>
                                    <Text style={styles.gridOptionText}>Camera</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.gridOption}
                                    onPress={() => {
                                        setIsImageModalVisible(false);
                                        setTimeout(pickFile, 300);
                                    }}
                                >
                                    <View style={styles.gridIconContainer}>
                                        <Feather name="file" size={24} color="#0F172A" />
                                    </View>
                                    <Text style={styles.gridOptionText}>File</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </Pressable>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const markdownStyles = StyleSheet.create({
    body: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#0F172A',
        lineHeight: 28,
    },
    heading1: {
        fontSize: 24,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
        marginTop: 16,
        marginBottom: 8,
    },
    heading2: {
        fontSize: 20,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
        marginTop: 14,
        marginBottom: 6,
    },
    heading3: {
        fontSize: 18,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
        marginTop: 12,
        marginBottom: 4,
    },
    strong: {
        fontFamily: 'FKGrotesk-Bold',
        fontWeight: '700' as const,
    },
    em: {
        fontStyle: 'italic',
    },
    bullet_list: {
        marginTop: 8,
        marginBottom: 8,
    },
    ordered_list: {
        marginTop: 8,
        marginBottom: 8,
    },
    list_item: {
        marginVertical: 4,
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 0,
    },
    link: {
        color: '#3B82F6',
        textDecorationLine: 'underline',
    },
});
