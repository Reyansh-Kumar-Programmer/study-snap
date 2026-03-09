import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';

interface SectionCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const SectionCard: React.FC<SectionCardProps> = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        // Removing shadows for a flatter, more modern minimalist look
        elevation: 0,
        shadowOpacity: 0,
    },
});
