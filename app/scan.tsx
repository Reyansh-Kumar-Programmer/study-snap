import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import Markdown from 'react-native-markdown-display';
import { generateStudyMaterial } from '@/services/geminiService';
import { saveResult } from '@/services/storageService';

const { width, height } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const cameraRef = useRef<any>(null);
    const router = useRouter();

    const scanLineY = useSharedValue(0);
    const captureScale = useSharedValue(1);

    useEffect(() => {
        scanLineY.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2500 }),
                withTiming(0, { duration: 2500 })
            ),
            -1
        );
    }, []);

    const scanLineStyle = useAnimatedStyle(() => ({
        top: `${scanLineY.value * 100}%`,
    }));

    const captureButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: captureScale.value }],
    }));

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={80} color={Colors.primary} />
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        console.log("SCAN SCREEN: takePicture called");
        if (cameraRef.current) {
            captureScale.value = withSequence(withTiming(0.8), withSpring(1));
            try {
                const photo = await cameraRef.current.takePictureAsync({ 
                    quality: 0.8,
                    base64: true 
                });
                console.log("SCAN SCREEN: photo captured!", photo.uri);
                console.log("SCAN SCREEN: photo has base64?", !!photo.base64);
                setCapturedImage(photo.uri);
                analyzeImage(photo.uri, photo.base64);
            } catch (error) {
                console.error("SCAN SCREEN: Failed to take picture:", error);
            }
        } else {
            console.log("SCAN SCREEN: cameraRef.current is null!");
        }
    };

    const analyzeImage = async (uri: string, base64?: string) => {
        console.log("SCAN SCREEN: analyzeImage called with base64:", !!base64);
        setIsAnalyzing(true);
        try {
            const result = await generateStudyMaterial(uri, base64);
            setExplanation(result.explanation);
            
            // Save to history
            const id = Date.now().toString();
            await saveResult({
                id,
                imageUri: uri,
                date: new Date().toISOString(),
                ...result
            });
        } catch (error) {
            console.error("Analysis failed:", error);
            setCapturedImage(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetScan = () => {
        setCapturedImage(null);
        setExplanation(null);
        setIsAnalyzing(false);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {!capturedImage ? (
                <View style={styles.cameraWrapper}>
                    <CameraView
                        ref={cameraRef}
                        style={StyleSheet.absoluteFill}
                        facing="back"
                    >
                        <SafeAreaView style={styles.cameraOverlay}>
                            <View style={styles.cameraHeader}>
                                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                                    <Ionicons name="close" size={28} color="white" />
                                </TouchableOpacity>
                                <View style={styles.headerInfo}>
                                    <Text style={styles.headerTitle}>Scan Question</Text>
                                    <View style={styles.liveIndicator}>
                                        <View style={styles.liveDot} />
                                        <Text style={styles.liveText}>LIVE</Text>
                                    </View>
                                </View>
                                <View style={{ width: 44 }} />
                            </View>

                            <View style={styles.focusFrameContainer}>
                                <View style={styles.focusFrame}>
                                    <View style={[styles.corner, styles.topLeft]} />
                                    <View style={[styles.corner, styles.topRight]} />
                                    <View style={[styles.corner, styles.bottomLeft]} />
                                    <View style={[styles.corner, styles.bottomRight]} />
                                    <Animated.View style={[styles.scanLine, scanLineStyle]}>
                                        <LinearGradient
                                            colors={['transparent', 'rgba(59, 130, 246, 0.5)', 'transparent']}
                                            style={StyleSheet.absoluteFill}
                                        />
                                    </Animated.View>
                                </View>
                                <Text style={styles.hintText}>Align text inside the frame</Text>
                            </View>

                            <View style={styles.cameraFooter}>
                                <View style={styles.footerActions}>
                                    <TouchableOpacity style={styles.galleryBtn}>
                                        <Ionicons name="images-outline" size={24} color="white" />
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity onPress={takePicture} activeOpacity={0.8}>
                                        <Animated.View style={[styles.captureOuter, captureButtonStyle]}>
                                            <View style={styles.captureInner} />
                                        </Animated.View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.flashBtn}>
                                        <Ionicons name="flash-outline" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    </CameraView>
                </View>
            ) : (
                <View style={styles.resultView}>
                    <Image source={{ uri: capturedImage }} style={StyleSheet.absoluteFill} />
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                    
                    {isAnalyzing && (
                        <AnimatedView entering={FadeIn} style={styles.analyzingOverlay}>
                            <ActivityIndicator size="large" color="white" />
                            <Text style={styles.analyzingText}>AI is analyzing...</Text>
                        </AnimatedView>
                    )}

                    {explanation && (
                        <Animated.View entering={SlideInDown.springify()} style={styles.explanationCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardIndicator} />
                                <Text style={styles.cardTitle}>AI Explanation</Text>
                                <TouchableOpacity onPress={resetScan} style={styles.resetBtn}>
                                    <Ionicons name="refresh" size={20} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.cardScrollWrapper}>
                                <Markdown style={markdownStyles}>
                                    {explanation}
                                </Markdown>
                            </View>

                            <TouchableOpacity 
                                style={styles.chatAction}
                                onPress={() => router.push({
                                    pathname: '/chat',
                                    params: { initialQuestion: "Tell me more about this scan..." }
                                })}
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#2563EB']}
                                    style={styles.chatGradient}
                                >
                                    <Ionicons name="chatbubbles" size={20} color="white" />
                                    <Text style={styles.chatBtnText}>Ask Follow-up</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    cameraWrapper: {
        flex: 1,
        overflow: 'hidden',
    },
    cameraOverlay: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    cameraHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
        marginRight: 4,
    },
    liveText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    focusFrameContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    focusFrame: {
        width: width * 0.8,
        height: width * 0.8,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: 'white',
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderTopLeftRadius: 20,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderTopRightRadius: 20,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomLeftRadius: 20,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomRightRadius: 20,
    },
    scanLine: {
        position: 'absolute',
        left: 10,
        right: 10,
        height: 40,
        zIndex: 10,
    },
    hintText: {
        color: 'white',
        marginTop: 30,
        fontSize: 16,
        fontWeight: '500',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    cameraFooter: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    footerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-evenly',
    },
    captureOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureInner: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        backgroundColor: 'white',
    },
    galleryBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flashBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    permissionText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
        color: '#64748B',
    },
    permissionButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    resultView: {
        flex: 1,
    },
    analyzingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    analyzingText: {
        color: 'white',
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600',
    },
    explanationCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: height * 0.7,
        padding: 24,
        ...Colors.shadow,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    cardIndicator: {
        width: 40,
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.text,
    },
    resetBtn: {
        position: 'absolute',
        right: 0,
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardScrollWrapper: {
        flex: 1,
        marginBottom: 20,
    },
    chatAction: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    chatGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    chatBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    }
});

const markdownStyles = {
    body: {
        color: '#334155',
        fontSize: 16,
        lineHeight: 24,
    },
    heading1: {
        color: '#1E293B',
        fontSize: 24,
        fontWeight: '800' as const,
        marginVertical: 12,
    },
    heading2: {
        color: '#1E293B',
        fontSize: 20,
        fontWeight: '700' as const,
        marginVertical: 10,
    },
    strong: {
        color: '#2563EB',
        fontWeight: '700' as const,
    },
    list_item: {
        marginVertical: 4,
    }
};
