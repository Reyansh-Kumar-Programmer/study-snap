import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface BulletItemProps {
    text: string;
}

export const BulletItem: React.FC<BulletItemProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.bullet} />
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingRight: 10,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3B82F6',
        marginTop: 8,
        marginRight: 14,
        opacity: 0.8,
    },
    text: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: '#475569',
        fontFamily: 'FK-Grotesk-Medium',
        fontWeight: '500',
    },
});
