import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    Dimensions,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Keyboard,
    Pressable
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, {
    FadeInUp,
    FadeInDown,
    FadeOutDown,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
    interpolate,
    Extrapolation,
    useAnimatedScrollHandler,
    FadeIn,
    FadeOut,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { sendChatMessage, RevisionSheet } from '@/services/geminiService';
import { MathMarkdownRenderer } from '@/components/MathMarkdownRenderer';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BRAND_BLUE = '#3A42FF';
const BRAND_PURPLE = '#7D42FF';

const BG_WHITE = '#FFFFFF';
const SLATE_900 = '#0F172A';
const SLATE_500 = '#64748B';
const SLATE_200 = '#E2E8F0';

const ITEM_SIZE = SCREEN_WIDTH - 48 + 24;

interface AccordionItemProps {
    question: string;
    answer: string;
    index: number;
}

const AccordionItem = ({ question, answer, index }: AccordionItemProps) => {
    const [expanded, setExpanded] = useState(false);
    const progress = useSharedValue(0);

    const toggle = () => {
        setExpanded(!expanded);
        progress.value = withTiming(expanded ? 0 : 1, { duration: 300 });
    };

    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${progress.value * 180}deg` }]
        };
    });

    const headerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                ['#FFFFFF', '#F8FAFC']
            )
        };
    });

    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={toggle}>
                <Animated.View style={[styles.accordionHeader, headerStyle]}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Text style={styles.accordionIndex}>{String(index + 1).padStart(2, '0')}   </Text>
                        <View style={{ flex: 1, marginTop: -2 }}>
                             <MathMarkdownRenderer content={question} fontSize={16} color={expanded ? BRAND_BLUE : '#0F172A'} />
                        </View>
                    </View>
                    <Animated.View style={iconStyle}>
                        <Ionicons name="chevron-down" size={20} color={expanded ? BRAND_BLUE : SLATE_500} />
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>
            {expanded && (
                <Animated.View entering={FadeIn.duration(300)} style={styles.accordionBody}>
                    <MathMarkdownRenderer content={answer} fontSize={15} color={SLATE_500} />
                </Animated.View>
            )}
        </View>
    );
};

const DefinitionCard = ({ def, idx, total }: { def: any, idx: number, total: number }) => {
    const [expanded, setExpanded] = useState(false);
    
    // Safely guess if text is long based on character count as a primary metric
    const isLongText = def.definition && def.definition.length > 120;
    const [showReadMore, setShowReadMore] = useState(isLongText);

    return (
        <View style={[styles.defCard, { borderBottomColor: idx % 2 === 0 ? BRAND_BLUE : BRAND_PURPLE }]}>
            <View style={styles.defCardHeader}>
                <View style={[styles.defIconBadge, { backgroundColor: idx % 2 === 0 ? BRAND_BLUE : BRAND_PURPLE }]}>
                    <Ionicons name="bookmark" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.defCardIndex}>{String(idx + 1).padStart(2, '0')} · {String(total).padStart(2, '0')}</Text>
            </View>
            <View style={styles.defContent}>
                <Text style={styles.defTerm}>{def.term}</Text>
                <View style={styles.defDivider} />
                
                {!expanded ? (
                    <View style={{ maxHeight: 90, overflow: 'hidden' }}>
                        <View onLayout={(e) => {
                            if (e.nativeEvent.layout.height > 95) {
                                setShowReadMore(true);
                            }
                        }}>
                            <MathMarkdownRenderer content={def.definition} fontSize={15} color={SLATE_500} />
                        </View>
                    </View>
                ) : (
                    <Animated.View entering={FadeIn.duration(300)}>
                        <MathMarkdownRenderer content={def.definition} fontSize={15} color={SLATE_500} />
                    </Animated.View>
                )}

                {showReadMore && !expanded && (
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setExpanded(true)} style={styles.readMoreBtn}>
                        <Text style={styles.readMoreText}>Read more</Text>
                        <Ionicons name="chevron-down" size={14} color={BRAND_BLUE} />
                    </TouchableOpacity>
                )}
                {showReadMore && expanded && (
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setExpanded(false)} style={styles.readMoreBtn}>
                        <Text style={styles.readMoreText}>Show less</Text>
                        <Ionicons name="chevron-up" size={14} color={BRAND_BLUE} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// LARGE FLASHCARD COMPONENT WITH SWIPE & 3D FLIP ANIMATIONS
const LargeFlashcardItem = ({ term, definition, flashcardQuestion, index, total, scrollX }: any) => {
    const isFlipped = useState(false);
    const flipValue = useSharedValue(0);

    const toggleFlip = () => {
        flipValue.value = withSpring(flipValue.value === 0 ? 180 : 0, { damping: 18, stiffness: 120 });
    };

    const animatedSwipeStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE
        ];

        const scale = interpolate(scrollX.value, inputRange, [0.85, 1, 0.85], Extrapolation.CLAMP);
        const rotateZ = interpolate(scrollX.value, inputRange, [-5, 0, 5], Extrapolation.CLAMP);
        const translateY = interpolate(scrollX.value, inputRange, [40, 0, 40], Extrapolation.CLAMP);
        const opacity = interpolate(scrollX.value, inputRange, [0.35, 1, 0.35], Extrapolation.CLAMP);

        return {
            transform: [
                { translateY },
                { scale }, 
                { rotateZ: `${rotateZ}deg` }
            ],
            opacity
        };
    });

    const frontAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ perspective: 1200 }, { rotateY: `${flipValue.value}deg` }],
            opacity: flipValue.value >= 90 ? 0 : 1,
            zIndex: flipValue.value >= 90 ? 0 : 1
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ perspective: 1200 }, { rotateY: `${flipValue.value - 180}deg` }],
            opacity: flipValue.value >= 90 ? 1 : 0,
            zIndex: flipValue.value >= 90 ? 1 : 0
        };
    });

    return (
        <Animated.View style={[animatedSwipeStyle, { width: SCREEN_WIDTH - 48, height: SCREEN_HEIGHT * 0.55 }]}>
            <Pressable style={{ flex: 1 }} onPress={toggleFlip}>
                <View style={{ flex: 1, borderRadius: 32 }}>
                    
                    {/* Front (Question) */}
                    <Animated.View style={[styles.largeFlashcard, frontAnimatedStyle, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
                        <LinearGradient 
                            colors={['#0F172A', '#1E293B']} 
                            start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
                            style={styles.largeGradientCard}
                        >
                            <View style={styles.largeFlashcardHeader}>
                                <View style={styles.flashcardBadge}>
                                    <Text style={styles.flashcardBadgeText}>QUESTION</Text>
                                </View>
                                <Text style={[styles.largeFlashcardIndex, { color: '#64748B' }]}>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</Text>
                            </View>
                            
                            <View style={styles.largeFlashcardContent}>
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                                    {flashcardQuestion ? (
                                        <>
                                            <Text style={styles.questionPrefix}>Question</Text>
                                            <View style={{ marginTop: 16 }}>
                                                <MathMarkdownRenderer content={`**${flashcardQuestion}**`} fontSize={28} color="#FFFFFF" />
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.questionPrefix}>What is</Text>
                                            <View style={{ marginTop: 16 }}>
                                                <MathMarkdownRenderer content={`**${term}?**`} fontSize={32} color="#FFFFFF" />
                                            </View>
                                        </>
                                    )}
                                </ScrollView>
                            </View>

                            <View style={styles.largeFlashcardFooter}>
                                <Ionicons name="repeat" size={20} color="#64748B" />
                                <Text style={[styles.largeFlashcardHint, { color: '#64748B' }]}>Tap to reveal answer</Text>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* Back (Answer) */}
                    <Animated.View style={[styles.largeFlashcard, backAnimatedStyle, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
                         <LinearGradient 
                            colors={['#4F46E5', '#818CF8']} 
                            start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
                            style={styles.largeGradientCard}
                        >
                            <View style={styles.largeFlashcardHeader}>
                                <View style={[styles.flashcardBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                    <Text style={[styles.flashcardBadgeText, { color: '#FFFFFF' }]}>ANSWER</Text>
                                </View>
                                <Text style={[styles.largeFlashcardIndex, { color: '#E0E7FF' }]}>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</Text>
                            </View>

                            <View style={styles.largeFlashcardContent}>
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                                    <Text style={[styles.largeFlashcardText, { marginBottom: 16, color: '#E0E7FF', fontSize: 24, fontFamily: 'Tiempos-Headline' }]}>{term}</Text>
                                    <MathMarkdownRenderer content={definition} fontSize={20} color="#FFFFFF" />
                                </ScrollView>
                            </View>

                            <View style={styles.largeFlashcardFooter}>
                                <Ionicons name="repeat" size={20} color="rgba(255,255,255,0.6)" />
                                <Text style={[styles.largeFlashcardHint, { color: 'rgba(255,255,255,0.6)' }]}>Tap to flip back</Text>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                </View>
            </Pressable>
        </Animated.View>
    );
};

export default function RevisionSheetScreen() {
    const { data } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState<'notes' | 'flashcards'>('notes');
    const togglePosition = useSharedValue(0);

    const scrollX = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        }
    });

    useEffect(() => {
        togglePosition.value = withSpring(activeTab === 'notes' ? 0 : 1, {
            damping: 20,
            stiffness: 200,
        });
    }, [activeTab]);

    const toggleAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: togglePosition.value * 110 }]
        };
    });

    // Chat Modal States
    const [isDoubtModalVisible, setIsDoubtModalVisible] = useState(false);
    const [modalInputText, setModalInputText] = useState('');
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai', content: string }>>([
        { role: 'ai', content: "Hi! I'm your AI Study Assistant. What doubt do you have from this revision sheet?" }
    ]);
    const [isGenerating, setIsGenerating] = useState(false);
    const chatScrollRef = useRef<ScrollView>(null);
    const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
    const modalInputAnimatedStyle = useAnimatedStyle(() => ({
        paddingBottom: Math.abs(keyboardHeight.value) + (Math.abs(keyboardHeight.value) > 0 ? 8 : (Platform.OS === 'ios' ? 40 : 24))
    }));

    let sheetData: RevisionSheet | null = null;
    try {
        if (typeof data === 'string') {
            sheetData = JSON.parse(data);
        }
    } catch (e) {
        console.error("Failed to parse sheet data", e);
    }

    if (!sheetData) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={BRAND_BLUE} />
                <Text style={styles.errorText}>Failed to load revision data.</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { title, description, definitions, keyPoints, faq } = sheetData;

    const handleSendMessage = async () => {
        if (!modalInputText.trim() || isGenerating) return;
        const userMsg = modalInputText.trim();
        
        // Prepare history: transform 'ai' to 'model' and filter out the initial greeting
        const currentHistoryForAPI = chatHistory
            .filter(m => m.content !== "Hi! I'm your AI Study Assistant. What doubt do you have from this revision sheet?")
            .map(m => ({
                role: m.role === 'ai' ? 'model' : 'user',
                text: m.content
            }));

        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setModalInputText('');
        setIsGenerating(true);
        
        // Wait 100ms before dismissing to avoid flicker
        setTimeout(() => Keyboard.dismiss(), 100);

        // scroll down
        setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const aiResponse = await sendChatMessage(currentHistoryForAPI, userMsg, sheetData);
            setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse || "Sorry, I couldn't process that query." }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error connecting to my knowledge base. Please try again." }]);
        } finally {
            setIsGenerating(true); // Artificial delay for smoother transition
            setTimeout(() => {
                setIsGenerating(false);
                setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
            }, 600);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.navHeader, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 50 : 30) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.navBack}>
                    <Ionicons name="arrow-back" size={22} color={SLATE_900} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Revision Sheet</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Editorial Header */}
                <Animated.View entering={FadeInDown.duration(600).springify().damping(18)} style={styles.headerSection}>
                    <Text style={styles.superTitle}>Revision Sheet</Text>
                    <Text style={styles.mainTitle} adjustsFontSizeToFit numberOfLines={2}>{title}</Text>
                </Animated.View>

                {/* Global Segmented Toggle (Placed Below Title, Above Key Defs as requested) */}
                <Animated.View entering={FadeInDown.duration(600).delay(50)} style={styles.segmentWrapper}>
                    <View style={styles.segmentTrack}>
                        <Animated.View style={[styles.segmentIndicator, toggleAnimatedStyle]} />
                        <TouchableOpacity style={styles.segmentBtn} onPress={() => setActiveTab('notes')} activeOpacity={0.8}>
                            <Text style={[styles.segmentText, activeTab === 'notes' && styles.segmentTextActive]}>Notes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.segmentBtn} onPress={() => setActiveTab('flashcards')} activeOpacity={0.8}>
                            <Text style={[styles.segmentText, activeTab === 'flashcards' && styles.segmentTextActive]}>Flashcards</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {activeTab === 'notes' ? (
                    <Animated.View
                        entering={FadeIn.duration(400)}
                        exiting={FadeOut.duration(200)}
                    >
                        {/* Key Definitions - Single Card Carousel */}
                        {definitions && definitions.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.defHeaderContainer}>
                                    <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Key Definitions</Text>
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{definitions.length} Cards</Text>
                                    </View>
                                </View>
                                
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.defScroll}
                                    decelerationRate="fast"
                                    snapToInterval={SCREEN_WIDTH - 72 + 16} // CARD_WIDTH + gap
                                    snapToAlignment="center"
                                    disableIntervalMomentum={true}
                                >
                                    {definitions.map((def, idx) => (
                                        <DefinitionCard key={idx} def={def} idx={idx} total={definitions.length} />
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Description Block */}
                        {description && (
                            <View style={styles.introContainer}>
                                <Text style={styles.sectionTitle}>What is {title}</Text>
                                <View style={{ paddingHorizontal: 24 }}>
                                    <MathMarkdownRenderer content={description} fontSize={16} color="#374151" />
                                </View>
                            </View>
                        )}

                        {/* Key Points - Elegant Timeline Strategy */}
                        {keyPoints && keyPoints.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.divider} />
                                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Key Points</Text>

                                <View style={styles.timelineContainer}>
                                    <LinearGradient
                                        colors={[BRAND_BLUE, BRAND_PURPLE, 'transparent']}
                                        style={styles.timelineTrack}
                                    />

                                    {keyPoints.map((point, index) => (
                                        <View key={index} style={styles.timelineNode}>
                                            <View style={styles.timelineIndicator}>
                                                <View style={styles.timelineDot} />
                                            </View>
                                            <View style={styles.timelineCard}>
                                                <MathMarkdownRenderer content={point} fontSize={15} color="#334155" />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* FAQ High-End Accordion */}
                        {faq && faq.length > 0 && (
                            <View style={styles.section}>
                                <View style={[styles.divider, { marginBottom: 24 }]} />
                                <Text style={styles.sectionTitle}>FAQ</Text>
                                <View style={styles.faqList}>
                                    {faq.map((item, idx) => (
                                        <AccordionItem key={idx} index={idx} question={item.question} answer={item.answer} />
                                    ))}
                                </View>
                            </View>
                        )}
                    </Animated.View>
                ) : (
                    <Animated.View 
                        entering={FadeIn.duration(400)} 
                        exiting={FadeOut.duration(200)} 
                        style={styles.flashcardsContainer}
                    >
                        <Animated.ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.largeDefScroll}
                            decelerationRate="fast"
                            snapToInterval={ITEM_SIZE}
                            snapToAlignment="center"
                            disableIntervalMomentum={true}
                            onScroll={scrollHandler}
                            scrollEventThrottle={16}
                        >
                            {definitions.map((def, idx) => (
                                <LargeFlashcardItem 
                                    key={idx}
                                    term={def.term} 
                                    definition={def.definition} 
                                    flashcardQuestion={def.flashcardQuestion}
                                    index={idx} 
                                    total={definitions.length} 
                                    scrollX={scrollX}
                                />
                            ))}
                        </Animated.ScrollView>
                        <Text style={styles.swipeHint}>Swipe left or right to explore more</Text>
                    </Animated.View>
                )}

                {/* Extra space for the bottom bar so content isn't hidden behind it */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Input Bar wrapper */}
            {!isDoubtModalVisible && (
                <Animated.View 
                    entering={FadeInDown.delay(200).duration(600)} 
                    exiting={FadeOutDown.duration(400)}
                    style={styles.bottomBarContainer}
                >
                    <TouchableOpacity
                        style={styles.bottomInputBox}
                        activeOpacity={0.9}
                        onPress={() => setIsDoubtModalVisible(true)}
                    >
                        <Text style={styles.bottomInputPlaceholder}>Ask your doubt...</Text>
                        <View style={styles.bottomSendBtnWrap}>
                            <View style={[styles.bottomSendBtn, { backgroundColor: BRAND_BLUE }]}>
                                <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* AI Doubt Modal (90% Height) */}
            <Modal
                visible={isDoubtModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsDoubtModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {/* Backdrop: only covers the 10% area above the sheet */}
                    <Pressable style={styles.modalBackdrop} onPress={() => setIsDoubtModalVisible(false)} />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalDragHandle} />
                            <View style={styles.modalHeaderTop}>
                                <View>
                                    <Text style={styles.modalHeaderTitle}>Doubt Solver</Text>
                                    <Text style={styles.modalHeaderSubtitle}>Revision AI</Text>
                                </View>
                                <TouchableOpacity onPress={() => setIsDoubtModalVisible(false)} style={styles.modalCloseBtn}>
                                    <Ionicons name="close" size={20} color={SLATE_900} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView 
                            ref={chatScrollRef}
                            style={styles.modalChatScroll} 
                            contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {chatHistory.map((msg, i) => (
                                <View key={i} style={[styles.chatRow, msg.role === 'user' ? styles.userRow : styles.aiRow]}>
                                    {msg.role === 'user' ? (
                                        <LinearGradient colors={['#F8FAFC', '#EFF3F8']} style={styles.userBubble}>
                                            <Text style={styles.userText}>{msg.content}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={styles.aiMessageContainer}>
                                            <MathMarkdownRenderer content={msg.content} fontSize={15} />
                                        </View>
                                    )}
                                </View>
                            ))}
                            {isGenerating && (
                                <View style={{ paddingLeft: 8 }}>
                                    <ThinkingIndicator />
                                </View>
                            )}
                        </ScrollView>

                        <Animated.View style={[styles.modalInputWrapper, modalInputAnimatedStyle]}>
                            <View style={styles.modalInputInner}>
                                <TextInput
                                    placeholder="Ask your doubt..."
                                    style={styles.modalInput}
                                    value={modalInputText}
                                    onChangeText={setModalInputText}
                                    placeholderTextColor="#94A3B8"
                                    multiline
                                />
                                <TouchableOpacity 
                                    style={[styles.modalSendBtn, { backgroundColor: BRAND_BLUE }]}
                                    onPress={handleSendMessage}
                                >
                                    <Ionicons name="arrow-up" size={18} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_WHITE,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Medium',
        color: '#ef4444',
        marginTop: 16,
    },
    backBtn: {
        marginTop: 24,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    backBtnText: {
        fontFamily: 'FKGrotesk-Bold',
        color: SLATE_900,
    },
    navHeader: {
        paddingHorizontal: 20,
        paddingBottom: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BG_WHITE,
        zIndex: 10,
    },
    navBack: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Bold',
        color: SLATE_900,
    },
    
    // Global Segmented Toggle
    segmentWrapper: {
        paddingHorizontal: 24,
        marginBottom: 24,
        backgroundColor: BG_WHITE,
        alignItems: 'flex-start',
    },
    segmentTrack: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 100,
        padding: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        position: 'relative',
    },
    segmentIndicator: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 4,
        width: 110,
        backgroundColor: BRAND_BLUE,
        borderRadius: 100,
        shadowColor: BRAND_BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    segmentBtn: {
        width: 110,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    segmentText: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Medium',
        color: '#64748B',
    },
    segmentTextActive: {
        color: '#FFFFFF',
        fontFamily: 'FKGrotesk-Bold',
    },

    flashcardsContainer: {
        alignItems: 'center',
        marginTop: 0,
    },
    largeDefScroll: {
        paddingHorizontal: 24,
        gap: 24,
        alignItems: 'center',
    },
    largeFlashcard: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    largeGradientCard: {
        flex: 1,
        borderRadius: 32,
        padding: 32,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    largeFlashcardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flashcardBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    flashcardBadgeText: {
        fontSize: 11,
        fontFamily: 'FKGrotesk-Bold',
        letterSpacing: 1.5,
        color: '#94A3B8',
    },
    largeFlashcardIndex: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Bold',
        letterSpacing: 2,
    },
    largeFlashcardContent: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    questionPrefix: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Medium',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        textAlign: 'center',
    },
    largeFlashcardTerm: {
        fontSize: 38,
        fontFamily: 'Tiempos-Headline',
        color: '#F8FAFC',
        lineHeight: 46,
        textAlign: 'center',
    },
    largeFlashcardText: {
        fontSize: 20,
        fontFamily: 'FKGrotesk-Regular',
        color: '#FFFFFF',
        lineHeight: 30,
        textAlign: 'center',
    },
    largeFlashcardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    largeFlashcardHint: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Medium',
        marginLeft: 8,
    },
    swipeHint: {
        fontSize: 13,
        color: '#94A3B8',
        fontFamily: 'FKGrotesk-Medium',
        marginBottom: 16,
        marginTop: 16,
    },

    scrollContent: {
        paddingBottom: 20,
    },
    headerSection: {
        paddingHorizontal: 24,
        marginTop: 12,
        marginBottom: 24,
    },
    superTitle: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Medium',
        color: '#4B5563',
        marginBottom: 8,
    },
    mainTitle: {
        fontSize: 36,
        fontFamily: 'Tiempos-Headline',
        color: SLATE_900,
        lineHeight: 42,
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'FKGrotesk-Medium',
        color: SLATE_900,
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    defHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 24,
        marginBottom: 16,
    },
    badgeContainer: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 18,
        paddingVertical: 6,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    badgeText: {
        fontSize: 12,
        fontFamily: 'FKGrotesk-Bold',
        color: SLATE_500,
    },
    defScroll: {
        paddingHorizontal: 36,
        gap: 16,
        alignItems: 'flex-start',
    },
    defCard: {
        width: SCREEN_WIDTH - 72,
        alignSelf: 'flex-start',
        backgroundColor: BG_WHITE,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderBottomWidth: 5,
    },
    defCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    defIconBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defCardIndex: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Bold',
        color: '#94A3B8',
        letterSpacing: 1,
    },
    defContent: {
        justifyContent: 'flex-start',
    },
    defTerm: {
        fontSize: 24,
        fontFamily: 'Tiempos-Headline',
        color: SLATE_900,
        lineHeight: 30,
    },
    defDivider: {
        height: 2,
        backgroundColor: '#F1F5F9',
        width: 40,
        marginVertical: 12,
        borderRadius: 1,
    },
    defText: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: SLATE_500,
        lineHeight: 24,
    },
    readMoreBtn: {
        marginTop: 14,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    readMoreText: {
        color: BRAND_BLUE,
        fontFamily: 'FKGrotesk-Bold',
        fontSize: 13,
        marginRight: 4,
    },
    introContainer: {
        marginBottom: 40,
    },
    descText: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: '#374151',
        lineHeight: 26,
        paddingHorizontal: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 24,
    },
    timelineContainer: {
        paddingHorizontal: 24,
        position: 'relative',
        marginTop: 10,
    },
    timelineTrack: {
        position: 'absolute',
        left: 43,
        top: 0,
        bottom: 0,
        width: 2,
        borderRadius: 1,
    },
    timelineNode: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    timelineIndicator: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        backgroundColor: BG_WHITE, 
        paddingVertical: 10,
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: BG_WHITE,
        borderWidth: 3,
        borderColor: BRAND_BLUE,
        shadowColor: BRAND_BLUE,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    },
    timelineCard: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    timelineText: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: '#334155',
        lineHeight: 24,
    },
    faqList: {
        paddingHorizontal: 24,
    },
    accordionContainer: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: SLATE_200,
        borderRadius: 16,
        backgroundColor: BG_WHITE,
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    accordionTitle: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'FKGrotesk-Bold',
        color: SLATE_900,
        paddingRight: 16,
        lineHeight: 22,
    },
    accordionTitleActive: {
        color: BRAND_BLUE,
    },
    accordionIndex: {
        color: '#94A3B8',
        fontSize: 13,
        letterSpacing: 1,
    },
    accordionBody: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        paddingTop: 0,
    },
    accordionAnswer: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Medium',
        color: SLATE_500,
        lineHeight: 24,
    },
    
    // Bottom Bar Styles
    bottomBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 20,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    bottomInputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 28,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    bottomInputPlaceholder: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: '#94A3B8',
    },
    bottomSendBtnWrap: {
        marginLeft: 10,
    },
    bottomSendBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        height: '10%',
    },
    modalContent: {
        height: '90%',
        backgroundColor: BG_WHITE,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: 'hidden',
    },
    modalHeader: {
        padding: 20,
        paddingTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#FFFFFF',
    },
    modalDragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalHeaderTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalHeaderTitle: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Bold',
        color: BRAND_BLUE,
        marginBottom: 2,
    },
    modalHeaderSubtitle: {
        fontSize: 18,
        fontFamily: 'Tiempos-Headline',
        color: SLATE_900,
    },
    modalCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalChatScroll: {
        flex: 1,
        backgroundColor: '#FCFDFF',
    },
    chatRow: {
        marginBottom: 16,
        width: '100%',
    },
    userRow: {
        alignItems: 'flex-end',
    },
    aiRow: {
        alignItems: 'flex-start',
    },
    userBubble: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderBottomRightRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        maxWidth: '85%',
    },
    userText: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: SLATE_900,
        lineHeight: 22,
    },
    aiMessageContainer: {
        maxWidth: '90%',
        paddingRight: 10,
    },
    modalInputWrapper: {
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    modalInputInner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 28,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    modalInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: SLATE_900,
        paddingTop: 10,
        paddingBottom: 10,
    },
    modalSendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
});
