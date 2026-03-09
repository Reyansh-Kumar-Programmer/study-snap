import React, { useState } from 'react';
import { StyleSheet, View, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// Attempt to use the native renderer if available (for Development Builds)
let EnrichedMarkdownText: any = null;
try {
    // This will only work in a custom development build, not Expo Go
    const Enriched = require('react-native-enriched-markdown');
    EnrichedMarkdownText = Enriched.EnrichedMarkdownText;
} catch (e) {
    // Fallback to WebView in Expo Go
}

interface MathMarkdownProps {
    children: string;
    style?: any;
    flavor?: 'commonmark' | 'github';
}

/**
 * MathMarkdown: A hybrid component that renders LaTeX and Markdown.
 * - In Development Builds: Uses react-native-enriched-markdown (Native performance).
 * - In Expo Go: Uses a high-fidelity WebView fallback with KaTeX (Zero-setup).
 */
export const MathMarkdown = ({ children, style, flavor = 'github' }: MathMarkdownProps) => {
    const [webViewHeight, setWebViewHeight] = useState(1);

    // Detect if we are in a native build or Expo Go
    // Usually EnrichedMarkdownText will be undefined in Expo Go
    if (EnrichedMarkdownText && Platform.OS !== 'web') {
        const markdownStyle = {
            paragraph: {
                fontSize: style?.body?.fontSize || 16,
                fontFamily: style?.body?.fontFamily || 'FK-Grotesk-Regular',
                color: style?.body?.color || '#0F172A',
                lineHeight: style?.body?.lineHeight || 24,
                marginTop: style?.paragraph?.marginTop ?? 8,
                marginBottom: style?.paragraph?.marginBottom ?? 8,
            },
            strong: {
                fontFamily: style?.strong?.fontFamily || 'FK-Grotesk-Bold',
                color: style?.strong?.color || style?.body?.color || '#0F172A',
            },
            em: {
                fontFamily: style?.em?.fontFamily || 'FK-Grotesk-Medium',
                fontStyle: 'italic' as const,
                color: style?.em?.color || style?.body?.color || '#0F172A',
            },
            math: {
                fontSize: style?.body?.fontSize || 16,
                color: style?.body?.color || '#0F172A',
                textAlign: 'center' as const,
                marginTop: 12,
                marginBottom: 12,
            },
            inlineMath: {
                color: style?.body?.color || '#0F172A',
            }
        };

        return (
            <View style={style?.container}>
                <EnrichedMarkdownText
                    markdown={children}
                    flavor={flavor}
                    markdownStyle={markdownStyle}
                    onLinkPress={({ url }: { url: string }) => Linking.openURL(url)}
                    md4cFlags={{ latexMath: true }}
                />
            </View>
        );
    }

    // --- High-Fidelity WebView Fallback (Works in Expo Go!) ---
    const escapedChildren = JSON.stringify(children);
    const bodyColor = style?.body?.color || '#0F172A';
    const bgColor = 'transparent';
    const fontSize = style?.body?.fontSize || 16;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js"></script>
        <style>
            @font-face {
                font-family: 'FK-Grotesk-Regular';
                src: local('-apple-system'), local('Roboto');
            }
            body { 
                font-family: 'FK-Grotesk-Regular', -apple-system, system-ui, sans-serif; 
                font-size: ${fontSize}px; 
                color: ${bodyColor}; 
                line-height: 1.5; 
                margin: 0; 
                padding: 0; 
                background-color: ${bgColor}; 
            }
            p { margin: 0 0 12px 0; }
            strong { font-weight: 700; }
            .katex { font-size: 1.1em; }
            .katex-display { margin: 1em 0; overflow-x: auto; overflow-y: hidden; }
        </style>
    </head>
    <body>
        <div id="content"></div>
        <script>
            try {
                const md = window.markdownit({ html: true, linkify: true, typographer: true });
                const content = ${escapedChildren};
                document.getElementById('content').innerHTML = md.render(content);
                renderMathInElement(document.body, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\\\(', right: '\\\\)', display: false},
                        {left: '\\\\[', right: '\\\\]', display: true}
                    ],
                    throwOnError: false
                });
                
                // Update height
                setTimeout(() => {
                    const height = document.body.scrollHeight;
                    window.ReactNativeWebView.postMessage(height.toString());
                }, 100);
            } catch (e) {
                document.body.innerHTML = e.message;
            }
        </script>
    </body>
    </html>
    `;

    return (
        <View style={[style?.container, { height: webViewHeight, overflow: 'hidden' }]}>
            <WebView
                source={{ html }}
                scrollEnabled={false}
                onMessage={(event) => {
                    const height = parseInt(event.nativeEvent.data);
                    if (height > 0) setWebViewHeight(height + 10);
                }}
                style={{ backgroundColor: 'transparent' }}
                javaScriptEnabled={true}
                originWhitelist={['*']}
            />
        </View>
    );
};
