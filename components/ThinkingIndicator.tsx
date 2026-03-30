import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

export const ThinkingIndicator = () => {
    const opacity = useSharedValue(0.4);
    
    useEffect(() => {
        opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View style={styles.thinkingRow}>
            <View style={styles.thinkingDot} />
            <Animated.Text style={[styles.thinkingText, animStyle]}>Thinking…</Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    thinkingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    thinkingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3A42FF', // BRAND_BLUE
        opacity: 0.5,
    },
    thinkingText: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Regular',
        color: '#64748B',
        fontStyle: 'italic',
    },
});
