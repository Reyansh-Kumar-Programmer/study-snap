import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MathMarkdown } from '../MathMarkdown';

interface TermItemProps {
    term: string;
    definition: string;
}

export const TermItem: React.FC<TermItemProps> = ({ term, definition }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.term}>{term}</Text>
            <MathMarkdown style={definitionMarkdownStyles}>{definition}</MathMarkdown>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.03)',
    },
    term: {
        fontSize: 18,
        fontFamily: 'FK-Grotesk-Bold',
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    definition: {
        fontSize: 15,
        fontFamily: 'FK-Grotesk-Medium',
        fontWeight: '500',
        color: '#64748B',
        lineHeight: 22,
    },
});

const definitionMarkdownStyles = StyleSheet.create({
    body: {
        fontSize: 15,
        fontFamily: 'FK-Grotesk-Medium',
        fontWeight: '500',
        color: '#64748B',
        lineHeight: 22,
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 0,
    }
});
