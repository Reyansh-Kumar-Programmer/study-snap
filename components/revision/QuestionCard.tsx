import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MathMarkdown } from '../MathMarkdown';

interface QuestionCardProps {
    question: string;
    type: 'Short Answer' | 'Long Answer';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, type }) => {
    const isLong = type === 'Long Answer';

    return (
        <View style={[styles.card, isLong && styles.longCard]}>
            <View style={styles.typeBadge}>
                <Ionicons name="help-circle-outline" size={14} color="#3B82F6" style={{ marginRight: 4 }} />
                <Text style={styles.typeText}>{type}</Text>
            </View>
            <MathMarkdown style={questionMarkdownStyles}>{question}</MathMarkdown>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
    },
    longCard: {
        borderColor: '#E2E8F0',
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    typeText: {
        fontSize: 10,
        fontFamily: 'FK-Grotesk-Bold',
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    questionText: {
        fontSize: 17,
        lineHeight: 24,
        color: '#0F172A',
        fontFamily: 'FK-Grotesk-Medium',
        fontWeight: '600',
    },
});

const questionMarkdownStyles = StyleSheet.create({
    body: {
        fontSize: 17,
        lineHeight: 24,
        color: '#0F172A',
        fontFamily: 'FK-Grotesk-Medium',
        fontWeight: '600',
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 0,
    }
});
