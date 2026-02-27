import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { getHistory } from '@/services/storageService';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Question {
    question: string;
    options: string[];
    answer: number;
}

export default function QuizScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const history = await getHistory();
            const item = history.find((h: any) => h.id === id);
            if (item && item.quiz) {
                setQuestions(item.quiz);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (questions.length === 0) return <SafeAreaView style={styles.container} />;

    const handleSelect = (index: number) => {
        if (showResult) return;
        setSelectedOption(index);
    };

    const checkAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === questions[currentQuestion].answer;
        if (isCorrect) setScore(s => s + 1);

        setShowResult(true);
    };

    const nextQuestion = () => {
        setSelectedOption(null);
        setShowResult(false);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1);
        }
    };

    const isFinished = currentQuestion === questions.length - 1 && showResult;

    const renderFinished = () => (
        <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient colors={['#F8FAFC', '#EFF6FF']} style={StyleSheet.absoluteFillObject} />
            
            <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.scoreCard}>
                <View style={styles.scoreIconBadge}>
                    <Ionicons name="trophy" size={48} color={Colors.primary} />
                </View>

                <Text style={styles.scoreTitle}>Quiz Complete!</Text>
                <Text style={styles.scoreSubtitle}>Great job mastering this topic.</Text>

                <View style={styles.scoreStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{score}/{questions.length}</Text>
                        <Text style={styles.statLabel}>Score</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{Math.round((score / questions.length) * 100)}%</Text>
                        <Text style={styles.statLabel}>Accuracy</Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
                        <Text style={styles.secondaryButtonText}>Back to Hub</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => {
                            setCurrentQuestion(0);
                            setScore(0);
                            setSelectedOption(null);
                            setShowResult(false);
                        }}
                    >
                        <LinearGradient colors={['#4F46E5', '#6366F1']} style={StyleSheet.absoluteFillObject} />
                        <Text style={styles.primaryButtonText}>Retake Quiz</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );

    if (isFinished) return renderFinished();

    const question = questions[currentQuestion];
    const progress = ((currentQuestion) / questions.length) * 100;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient colors={['#F8FAFC', '#EFF6FF']} style={StyleSheet.absoluteFillObject} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.progressBarBg}>
                    <Animated.View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>{currentQuestion + 1} / {questions.length}</Text>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View
                    key={currentQuestion}
                    entering={FadeInRight.duration(400)}
                    exiting={FadeOutLeft.duration(400)}
                >
                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>{question.question}</Text>
                    </View>

                    {question.options.map((option, index) => {
                        let backgroundColor = '#FFFFFF';
                        let borderColor = '#E2E8F0';
                        let textColor = Colors.text;

                        if (selectedOption === index) {
                            backgroundColor = '#EEF2FF';
                            borderColor = '#6366F1';
                        }

                        if (showResult) {
                            if (index === question.answer) {
                                backgroundColor = '#ECFDF5';
                                borderColor = '#10B981';
                            } else if (index === selectedOption && index !== question.answer) {
                                backgroundColor = '#FEF2F2';
                                borderColor = '#EF4444';
                            }
                        }

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.option, { backgroundColor, borderColor }]}
                                onPress={() => handleSelect(index)}
                                disabled={showResult}
                                activeOpacity={0.7}
                            >
                                <View style={styles.optionRow}>
                                    <View style={[
                                        styles.optionDot, 
                                        selectedOption === index && { borderColor: '#6366F1' },
                                        showResult && index === question.answer && { borderColor: '#10B981', backgroundColor: '#10B981' },
                                        showResult && index === selectedOption && index !== question.answer && { borderColor: '#EF4444', backgroundColor: '#EF4444' }
                                    ]}>
                                        {selectedOption === index && !showResult && <View style={styles.optionDotInner} />}
                                    </View>
                                    <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                                    
                                    {showResult && index === question.answer && (
                                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                    )}
                                    {showResult && index === selectedOption && index !== question.answer && (
                                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                {!showResult ? (
                    <TouchableOpacity
                        style={[styles.actionButton, selectedOption === null && styles.actionButtonDisabled]}
                        onPress={checkAnswer}
                        disabled={selectedOption === null}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>Check Answer</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                        onPress={nextQuestion}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>
                            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'transparent',
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarBg: {
        flex: 1,
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    progressTextContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textLight,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    questionBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        ...Colors.shadow,
        shadowOpacity: 0.05,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        lineHeight: 28,
    },
    option: {
        padding: 20,
        marginBottom: 16,
        borderRadius: 20,
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
        ...Colors.shadow,
        shadowOpacity: 0.02,
        shadowOffset: { width: 0, height: 2 },
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionDotInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#6366F1',
    },
    optionText: {
        fontSize: 16,
        flex: 1,
        fontWeight: '600',
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    actionButton: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonDisabled: {
        backgroundColor: '#CBD5E1',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    scoreCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        ...Colors.shadow,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 24,
    },
    scoreIconBadge: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    scoreTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 8,
    },
    scoreSubtitle: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: 32,
    },
    scoreStats: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        marginBottom: 32,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.textLight,
        fontWeight: '600',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E2E8F0',
    },
    actionRow: {
        flexDirection: 'column',
        width: '100%',
        gap: 16,
    },
    secondaryButton: {
        width: '100%',
        paddingVertical: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    primaryButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        overflow: 'hidden',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        zIndex: 1,
    }
});
