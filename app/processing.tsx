import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { generateStudyMaterial } from '@/services/geminiService';
import { saveResult } from '@/services/storageService';

export default function ProcessingScreen() {
    const { uri } = useLocalSearchParams<{ uri: string }>();
    const router = useRouter();
    const [status, setStatus] = useState("Analyzing image...");

    useEffect(() => {
        if (uri) {
            processImage(decodeURIComponent(uri));
        }
    }, [uri]);

    const processImage = async (imageUri: string) => {
        try {
            setStatus("Extracting text...");
            const result = await generateStudyMaterial(imageUri);
            setStatus("Generating study aids...");
            const id = Date.now().toString();
            const savedItem = { id, date: new Date().toISOString(), ...result };
            await saveResult(savedItem);
            // Small delay for UX
            setTimeout(() => {
                router.replace(`/results/${id}`);
            }, 500);
        } catch (error) {
            // Handle error
            console.error(error);
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.text}>{status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
        marginTop: 20,
        fontSize: 16,
        color: Colors.text,
        fontWeight: '600',
    }
});
