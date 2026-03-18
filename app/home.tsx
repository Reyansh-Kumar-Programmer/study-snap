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
}

const CourseCard = ({ title, subtitle, icon, iconType = 'Ionicons', delay = 0, onPress }: CourseCardProps) => (
    <Animated.View entering={FadeInUp.delay(delay).duration(600)}>
        <TouchableOpacity activeOpacity={0.72} style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                {iconType === 'Ionicons' ? (
                    <Ionicons name={icon as any} size={24} color={ACCENT_COLOR} />
                ) : (
                    <MaterialCommunityIcons name={icon as any} size={24} color={ACCENT_COLOR} />
                )}
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.cardSubtitle} numberOfLines={2}>{subtitle}</Text>
            </View>
            <View style={styles.cardArrow}>
                <Ionicons name="arrow-forward" size={14} color={ACCENT_COLOR} />
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

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(0).duration(700)} style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <View style={styles.greetingChip}>
                                <Text style={styles.greetingText}>{greeting} 👋</Text>
                            </View>
                            <Text style={styles.brandTitle}>TutorXpert</Text>
                            <Text style={styles.headerSubtitle}>Learn by class/subject (1–12)</Text>
                        </View>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                                <Ionicons name="search-outline" size={20} color={TEXT_DARK} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                                <Ionicons name="notifications-outline" size={20} color={TEXT_DARK} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Class Selector */}
                <Animated.View entering={FadeInUp.delay(100).duration(600)}>
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
                </Animated.View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <SectionTitle title="Academic & Professional Courses" delay={200} />
                    <View style={styles.grid}>
                        <CourseCard
                            title="Science & Technology"
                            subtitle="Physics, Chemistry, Bio"
                            icon="flask-outline"
                            delay={250}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'Science & Technology', greetMessage: "Hi! 👋 I'm your Science & Technology tutor. Ask me about Physics, Chemistry, Biology, or any scientific concept!" } })}
                        />
                        <CourseCard
                            title={"Art &\nHumanities"}
                            subtitle="History, Geography, Politics"
                            icon="color-palette-outline"
                            delay={300}
                            onPress={() => router.push({
                                pathname: '/chat',
                                params: {
                                    courseName: 'Art & Humanities',
                                    greetMessage: "Hi! 🎨 Ready to explore Art & Humanities? Ask me about History, Literature, Philosophy, and more!"
                                }
                            })}
                        />
                        <CourseCard
                            title="Management & Business"
                            subtitle="Economics, Accounts, BM"
                            icon="briefcase-outline"
                            delay={350}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'Management & Business', greetMessage: "Hi! 💼 Let's dive into Management & Business. I can help with Economics, Accounts, and Business Studies!" } })}
                        />
                        <CourseCard
                            title="Law & Legal Studies"
                            subtitle="Constitutional & Civil Law"
                            icon="scale-outline"
                            delay={400}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'Law & Legal Studies', greetMessage: "Hi! ⚖️ Welcome to Law & Legal Studies. Ask me about Constitutional Law, Legal Terms, or Case Studies!" } })}
                        />
                        <CourseCard
                            title="Coding & Programming"
                            subtitle="Python, C++, Web & AI"
                            icon="code-slash-outline"
                            delay={450}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'Coding & Programming', greetMessage: "Hi! 💻 Ready to code? Ask me about Python, C++, Web Development, Data Structures, or AI!" } })}
                        />
                        <CourseCard
                            title={"English Literature & Grammer"}
                            subtitle="Grammar, Essays & Prose"
                            icon="book-outline"
                            delay={500}
                            onPress={() => router.push({ pathname: '/chat', params: { courseName: 'English Literature', greetMessage: "Hi! 📚 Let's explore English Literature together. Ask about poems, prose, grammar, or essay writing!" } })}
                        />
                    </View>

                    <SectionTitle title="Competitive Exams Preparation" delay={550} />
                    <View style={styles.grid}>
                        <CourseCard title="10th Board Exam" subtitle="CBSE / ICSE" icon="document-text-outline" delay={600} />
                        <CourseCard title="12th Board Exam" subtitle="CBSE / ICSE" icon="document-text-outline" delay={650} />
                        <CourseCard title="CUET" subtitle="Start Preparation" icon="school-outline" delay={700} />
                        <CourseCard title="JEE Mains" subtitle="Engineering Entrance" icon="construct-outline" delay={750} />
                        <CourseCard title="JEE Advanced" subtitle="IIT Entrance" icon="rocket-outline" delay={800} />
                        <CourseCard title="NEET" subtitle="Medical Entrance" icon="medical-outline" delay={850} />
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
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 22,
        paddingTop: Platform.OS === 'android' ? 12 : 6,
        paddingBottom: 16,
        backgroundColor: BG_COLOR,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    greetingChip: {
        alignSelf: 'flex-start',
        backgroundColor: '#7C3AED14', // 8% opacity
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 10,
    },
    greetingText: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Medium',
        color: ACCENT_COLOR,
    },
    brandTitle: {
        fontSize: 30,
        fontFamily: 'Tiempos-Headline',
        color: TEXT_DARK,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Regular',
        color: TEXT_MUTED,
        marginTop: 3,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: CARD_BG,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    classScroll: {
        marginBottom: 8,
    },
    classScrollContent: {
        paddingHorizontal: 22,
        paddingBottom: 16,
        gap: 10,
    },
    classChip: {
        height: 54,
        paddingHorizontal: 26,
        borderRadius: 18,
        backgroundColor: '#EFF3F8',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    classChipActive: {
        backgroundColor: ACCENT_COLOR,
        borderColor: ACCENT_COLOR,
    },
    classChipText: {
        fontSize: 18,
        fontFamily: 'FKGrotesk-Medium',
        color: TEXT_MUTED,
    },
    classChipTextActive: {
        color: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 22,
        paddingBottom: 70, // More space for bottom input
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionAccentBar: {
        width: 3,
        height: 20,
        borderRadius: 2,
        backgroundColor: ACCENT_COLOR,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'FKGrotesk-Medium',
        color: TEXT_DARK,
        letterSpacing: -0.2,
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 28,
    },
    card: {
        width: (width - 56) / 2,
        height: 175,
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#EAEEF4',
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#7C3AED14', // 8% opacity
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Medium',
        color: TEXT_DARK,
        lineHeight: 21,
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
    },
    cardSubtitle: {
        fontSize: 12,
        fontFamily: 'FKGrotesk-Regular',
        color: TEXT_MUTED,
        flex: 1,
        paddingRight: 24,
    },
    cardArrow: {
        position: 'absolute',
        bottom: 20,
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
