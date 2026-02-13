import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';

interface ExplanationViewProps {
    content: string;
}

export default function ExplanationView({ content }: ExplanationViewProps) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Explanation</Text>
            <View style={styles.card}>
                <Text style={styles.text}>{content}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray[100],
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        ...Colors.shadow,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.text,
    }
});
