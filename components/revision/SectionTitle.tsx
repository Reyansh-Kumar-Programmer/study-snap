import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface SectionTitleProps {
    title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
    return (
        <View style={styles.container}>
            <MaskedView
                style={styles.maskedView}
                maskElement={<Text style={styles.title}>{title}</Text>}
            >
                <LinearGradient
                    colors={['#0B4DBB', '#1E6FE3', '#5DA9FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                />
            </MaskedView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    maskedView: {
        height: 32,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Tiempos-Medium',
        fontWeight: '700',
        backgroundColor: 'transparent',
        letterSpacing: -0.3,
    },
    gradient: {
        flex: 1,
    },
});
