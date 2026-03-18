import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ACCENT_COLOR = '#7C3AED';
const BG_COLOR = '#F8FAFC';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#0F172A';
const TEXT_MUTED = '#64748B';

interface CourseCardProps {
    title: string;
    subtitle: string;
    icon: string;
    iconType?: 'Ionicons' | 'MaterialCommunityIcons';
    delay?: number;
    onPress?: () => void;
    color?: string;
}

const CourseCard = ({ title, subtitle, icon, iconType = 'Ionicons', delay = 0, onPress, color = ACCENT_COLOR }: CourseCardProps) => (
    <Animated.View entering={FadeInUp.delay(delay).duration(600)}>
        <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
            <View style={[styles.cardGlow, { backgroundColor: color }]} />
            <View style={styles.cardIconBox}>
                <LinearGradient
                    colors={[`${color}20`, `${color}05`]}
                    style={styles.cardIconGradient}
                >
                    {iconType === 'Ionicons' ? (
                        <Ionicons name={icon as any} size={22} color={color} />
                    ) : (
                        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
                    )}
                </LinearGradient>
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>{subtitle}</Text>
            <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={14} color={color} />
            </View>
        </TouchableOpacity>
    </Animated.View>
);

const CLASS_CHIPS = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const SectionTitle = ({ title, delay = 0 }: { title: string; delay?: number }) => (
    <Animated.View entering={FadeInUp.delay(delay).duration(600)} style={styles.sectionTitleRow}>
        <View style={styles.sectionAccentBar} />
        <Text style={styles.sectionTitle}>{title}</Text>
    </Animated.View>
);

export default function HomeScreen() {
    const router = useRouter();
    const [selectedClass, setSelectedClass] = useState('Class 6');
    const [homeInputText, setHomeInputText] = useState('');
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />
            
            {/* Ambient Background Blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(0).duration(700)} style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.brandTitle}>TutorXpert</Text>
                            <Text style={styles.headerSubtitle}>Personal AI Learning Companion</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
                                <Ionicons name="notifications-outline" size={20} color={TEXT_DARK} />
                                <View style={styles.notifDot} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.profileBtn} activeOpacity={0.7}>
                                <Ionicons name="person-outline" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Greeting & Hero Section */}
                    <Animated.View entering={FadeInUp.delay(100).duration(700)} style={styles.greetingSection}>
                        <View style={styles.greetingBadge}>
                            <Ionicons name="sparkles" size={12} color={ACCENT_COLOR} />
                            <Text style={styles.greetingBadgeText}>{greeting.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.heroMainText}>
                            Ready to <Text style={styles.heroHighlight}>excel</Text>?
                        </Text>
                        <Text style={styles.heroSubText}>Master subjects with your personal AI tutor</Text>
                    </Animated.View>

                    {/* Featured Bento Box */}
                    <Animated.View entering={FadeInUp.delay(200).duration(700)} style={styles.featuredBento}>
                        <TouchableOpacity 
                            style={styles.bentoMainCard} 
                            activeOpacity={0.9}
                            onPress={() => router.push({ pathname: '/chat' })}
                        >
                            <LinearGradient
                                colors={[ACCENT_COLOR, '#6D28D9']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.bentoGradient}
                            >
                                <View style={styles.bentoContent}>
                                    <View style={styles.bentoIconBox}>
                                        <Ionicons name="flash-outline" size={24} color="#FFF" />
                                    </View>
                                    <View>
                                        <Text style={styles.bentoTitle}>Quick Chat AI</Text>
                                        <Text style={styles.bentoSubtitle}>Ask about any concept now</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#FFF" opacity={0.6} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Progress Card (StudySnap inspired) */}
                    <Animated.View entering={FadeInUp.delay(250).duration(700)} style={styles.progressCardOuter}>
                        <LinearGradient
                            colors={['#FFFFFF', '#FDFCFD']}
                            style={styles.progressCard}
                        >
                            <View style={styles.progressHeader}>
                                <View>
                                    <Text style={styles.progressTitle}>Weekly Progress</Text>
                                    <Text style={styles.progressSubtitle}>12 topics mastered this week</Text>
                                </View>
                                <View style={styles.progressPercentBox}>
                                    <Text style={styles.progressPercentText}>85%</Text>
                                </View>
                            </View>
                            <View style={styles.progressBarBg}>
                                <LinearGradient
                                    colors={[ACCENT_COLOR, '#A78BFA']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressBarFill, { width: '85%' }]}
                                />
                            </View>
                            <View style={styles.progressStats}>
                                <View style={styles.statItem}>
                                    <Ionicons name="time-outline" size={14} color={TEXT_MUTED} />
                                    <Text style={styles.statText}>4.5h Study</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Ionicons name="chatbubbles-outline" size={14} color={TEXT_MUTED} />
                                    <Text style={styles.statText}>28 Questions</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* Class Selector */}
                    <SectionTitle title="Select Your Class" delay={350} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.classScrollContent}
                        style={styles.classScroll}
                    >
                        {CLASS_CHIPS.map((cls) => {
                            const isActive = selectedClass === cls;
                            return (
                                <TouchableOpacity
                                    key={cls}
                                    onPress={() => setSelectedClass(cls)}
                                    activeOpacity={0.75}
                                    style={[
                                        styles.classChip,
                                        isActive && styles.classChipActive,
                                    ]}
                                >
                                    <Text style={[
                                        styles.classChipText,
                                        isActive && styles.classChipTextActive,
                                    ]}>{cls}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <SectionTitle title="Subjects & Courses" delay={450} />
                    <View style={styles.grid}>
                        <CourseCard
                            title="Science & Tech"
                            subtitle="Physics, Chemistry, Bio"
                            icon="flask-outline"
                            color="#3B82F6"
                            delay={450}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'Science & Technology', greetMessage: "Hi! 👋 I'm your Science & Technology tutor. Ask me about Physics, Chemistry, Biology, or any scientific concept!" } })}
                        />
                        <CourseCard
                            title={"Art &\nHumanities"}
                            subtitle="History, Geography, Politics"
                            icon="color-palette-outline"
                            color="#F59E0B"
                            delay={500}
                            onPress={() => router.push({
                                pathname: '/chat',
                                params: {
                                    courseName: 'Art & Humanities',
                                    greetMessage: "Hi! 🎨 Ready to explore Art & Humanities? Ask me about History, Literature, Philosophy, and more!"
                                }
                            })}
                        />
                        <CourseCard
                            title="Management"
                            subtitle="Economics, Accounts, BM"
                            icon="briefcase-outline"
                            color="#10B981"
                            delay={550}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'Management & Business', greetMessage: "Hi! 💼 Let's dive into Management & Business. I can help with Economics, Accounts, and Business Studies!" } })}
                        />
                        <CourseCard
                            title="Law & Legal"
                            subtitle="Constitutional & Civil Law"
                            icon="scale-outline"
                            color="#6366F1"
                            delay={600}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'Law & Legal Studies', greetMessage: "Hi! ⚖️ Welcome to Law & Legal Studies. Ask me about Constitutional Law, Legal Terms, or Case Studies!" } })}
                        />
                        <CourseCard
                            title="Coding & IT"
                            subtitle="Python, C++, Web & AI"
                            icon="code-slash-outline"
                            color="#EC4899"
                            delay={650}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'Coding & Programming', greetMessage: "Hi! 💻 Ready to code? Ask me about Python, C++, Web Development, Data Structures, or AI!" } })}
                        />
                        <CourseCard
                            title={"English & Grammer"}
                            subtitle="Grammar, Essays & Prose"
                            icon="book-outline"
                            color="#8B5CF6"
                            delay={700}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'English Literature', greetMessage: "Hi! 📚 Let's explore English Literature together. Ask about poems, prose, grammar, or essay writing!" } })}
                        />
                    </View>

                    <SectionTitle title="Competitive Exams" delay={600} />
                    <View style={styles.grid}>
                        <CourseCard title="10th Board" subtitle="CBSE / ICSE" icon="document-text-outline" color="#3B82F6" delay={650} />
                        <CourseCard title="12th Board" subtitle="CBSE / ICSE" icon="document-text-outline" color="#8B5CF6" delay={700} />
                        <CourseCard title="CUET" subtitle="Preparation" icon="school-outline" color="#10B981" delay={750} />
                        <CourseCard title="JEE Mains" subtitle="Engineering" icon="construct-outline" color="#F59E0B" delay={800} />
                        <CourseCard title="JEE Advanced" subtitle="IIT Entrance" icon="rocket-outline" color="#EF4444" delay={850} />
                        <CourseCard title="NEET" subtitle="Medical" icon="medical-outline" color="#EC4899" delay={900} />
                    </View>
                </ScrollView>

                {/* Bottom AI Input Bar */}
                <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ask TutorXpert anything..."
                            placeholderTextColor="#94A3B8"
                            value={homeInputText}
                            onChangeText={setHomeInputText}
                            onSubmitEditing={() => {
                                if (homeInputText.trim()) {
                                    router.push({
                                        pathname: '/chat',
                                        params: {
                                            courseName: selectedClass,
                                            greetMessage: `Hi! I'm ready to help you with ${selectedClass}.`,
                                            initialQuestion: homeInputText.trim()
                                        }
                                    });
                                    setHomeInputText('');
                                }
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, !homeInputText.trim() && styles.sendBtnDisabled]}
                            onPress={() => {
                                if (homeInputText.trim()) {
                                    router.push({
                                        pathname: '/chat',
                                        params: {
                                            courseName: selectedClass,
                                            greetMessage: `Hi! I'm ready to help you with ${selectedClass}.`,
                                            initialQuestion: homeInputText.trim()
                                        }
                                    });
                                    setHomeInputText('');
                                }
                            }}
                        >
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color={homeInputText.trim() ? '#FFF' : '#94A3B8'}
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_COLOR,
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#7C3AED08',
        zIndex: -1,
    },
    blob2: {
        position: 'absolute',
        bottom: 150,
        left: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#6366F105',
        zIndex: -1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 22,
        paddingTop: Platform.OS === 'android' ? 12 : 6,
        paddingBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 28,
        fontFamily: 'Tiempos-Headline',
        color: TEXT_DARK,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Regular',
        color: TEXT_MUTED,
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerIconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    notifDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: ACCENT_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
        elevation: 2,
    },
    greetingSection: {
        marginBottom: 24,
        paddingHorizontal: 1,
    },
    greetingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C3AED0F',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 6,
        marginBottom: 12,
    },
    greetingBadgeText: {
        fontSize: 11,
        fontFamily: 'FKGrotesk-Medium',
        color: ACCENT_COLOR,
        letterSpacing: 1,
    },
    heroMainText: {
        fontSize: 34,
        fontFamily: 'Tiempos-Headline',
        color: TEXT_DARK,
        letterSpacing: -0.8,
        lineHeight: 40,
    },
    heroHighlight: {
        color: ACCENT_COLOR,
    },
    heroSubText: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Regular',
        color: TEXT_MUTED,
        marginTop: 6,
    },
    featuredBento: {
        marginBottom: 28,
    },
    bentoMainCard: {
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: ACCENT_COLOR,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    bentoGradient: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bentoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    bentoIconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    bentoTitle: {
        fontSize: 19,
        fontFamily: 'FKGrotesk-Medium',
        color: '#FFF',
    },
    bentoSubtitle: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Regular',
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    classScroll: {
        marginBottom: 24,
        marginTop: 4,
    },
    classScrollContent: {
        paddingRight: 22,
        gap: 10,
    },
    classChip: {
        height: 52,
        paddingHorizontal: 22,
        borderRadius: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    progressCardOuter: {
        marginBottom: 28,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
    },
    progressCard: {
        padding: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressTitle: {
        fontSize: 17,
        fontFamily: 'FKGrotesk-Medium',
        color: TEXT_DARK,
    },
    progressSubtitle: {
        fontSize: 12,
        fontFamily: 'FKGrotesk-Regular',
        color: TEXT_MUTED,
        marginTop: 2,
    },
    progressPercentBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#7C3AED10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressPercentText: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Bold',
        color: ACCENT_COLOR,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 5,
        marginBottom: 16,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressStats: {
        flexDirection: 'row',
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 12,
        fontFamily: 'FKGrotesk-Medium',
        color: TEXT_MUTED,
    },
    classChipActive: {
        backgroundColor: ACCENT_COLOR,
        borderColor: ACCENT_COLOR,
        elevation: 4,
        shadowOpacity: 0.2,
    },
    classChipText: {
        fontSize: 16,
        color: TEXT_MUTED,
        fontFamily: 'FKGrotesk-Medium',
    },
    classChipTextActive: {
        color: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 22,
        paddingBottom: 120,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionAccentBar: {
        width: 3,
        height: 18,
        borderRadius: 2,
        backgroundColor: ACCENT_COLOR,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 19,
        fontFamily: 'FKGrotesk-Medium',
        color: TEXT_DARK,
        letterSpacing: -0.2,
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
        marginBottom: 32,
    },
    card: {
        width: (width - 58) / 2,
        height: 180,
        backgroundColor: CARD_BG,
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    cardGlow: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 100,
        height: 100,
        borderRadius: 50,
        opacity: 0.05,
        filter: 'blur(30px)',
    },
    cardIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        marginBottom: 14,
        overflow: 'hidden',
    },
    cardIconGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Medium',
        color: TEXT_DARK,
        lineHeight: 22,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 12,
        fontFamily: 'FKGrotesk-Regular',
        color: TEXT_MUTED,
        lineHeight: 18,
    },
    cardArrow: {
        position: 'absolute',
        bottom: 18,
        right: 18,
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
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'FKGrotesk-Regular',
        color: TEXT_DARK,
        paddingVertical: 8,
        paddingRight: 12,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: ACCENT_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#EFF3F8',
    },
});
