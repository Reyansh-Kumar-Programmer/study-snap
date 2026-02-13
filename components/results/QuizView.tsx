import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Question {
    question: string;
    options: string[];
    answer: number;
}

interface QuizViewProps {
    questions: Question[];
}

export default function QuizView({ questions }: QuizViewProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    if (!questions || questions.length === 0) {
        return <View style={styles.center}><Text>No questions available.</Text></View>;
    }

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
        } else {
            // Finished
        }
    };

    const isFinished = currentQuestion === questions.length - 1 && showResult;

    if (isFinished) {
        return (
            <View style={[styles.container, styles.center]}>
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreTitle}>Quiz Completed!</Text>
                    <Text style={styles.scoreText}>You scored {score}/{questions.length}</Text>
                    <Button title="Retake Quiz" onPress={() => {
                        setCurrentQuestion(0);
                        setScore(0);
                        setSelectedOption(null);
                        setShowResult(false);
                    }} />
                </View>
            </View>
        )
    }

    const question = questions[currentQuestion];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Quiz</Text>
                <Text style={styles.progress}>{currentQuestion + 1}/{questions.length}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.question}>{question.question}</Text>

                {question.options.map((option, index) => {
                    let backgroundColor = 'white';
                    let borderColor = 'transparent';

                    if (selectedOption === index) {
                        borderColor = Colors.primary;
                        backgroundColor = Colors.gray[100];
                    }

                    if (showResult) {
                        if (index === question.answer) {
                            backgroundColor = Colors.success + '20'; // Light success
                            borderColor = Colors.success;
                        } else if (index === selectedOption && index !== question.answer) {
                            backgroundColor = Colors.error + '20';
                            borderColor = Colors.error;
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.option, { backgroundColor, borderColor, borderWidth: 1 }]}
                            onPress={() => handleSelect(index)}
                            disabled={showResult}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.footer}>
                {!showResult ? (
                    <Button title="Check Answer" onPress={checkAnswer} disabled={selectedOption === null} />
                ) : (
                    <Button title={currentQuestion < questions.length - 1 ? "Next Question" : "Finish"} onPress={nextQuestion} />
                )}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray[100],
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    progress: {
        fontSize: 16,
        color: Colors.textLight,
        fontWeight: '600'
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        ...Colors.shadow,
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 24,
    },
    option: {
        padding: 16,
        backgroundColor: Colors.gray[100],
        borderRadius: 12,
        marginBottom: 12,
    },
    optionText: {
        fontSize: 16,
        color: Colors.text,
    },
    footer: {
        marginTop: 24,
    },
    scoreCard: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 24,
        alignItems: 'center',
        width: '100%',
        ...Colors.shadow
    },
    scoreTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 20,
        color: Colors.primary,
        fontWeight: '600',
        marginBottom: 24
    }
});
