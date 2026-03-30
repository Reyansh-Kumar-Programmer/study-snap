import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';

interface MathMarkdownRendererProps {
    content: string;
    fontSize?: number;
    color?: string;
}

export const MathMarkdownRenderer = ({ content, fontSize = 15, color = '#1E293B' }: MathMarkdownRendererProps) => {
    
    // Trim trailing whitespace/newlines and collapse excessive newlines (3+ → 2)
    // This prevents empty paragraphs that create big gaps at the bottom of cards
    let cleanContent = content.trim().replace(/\n{3,}/g, '\n\n');
    
    // Sanitize simple ₹ as well to avoid parsing issues
    cleanContent = cleanContent.replace(/₹/g, 'Rs.');

    // Catch common AI hallucinated unit commands that crash AndroidMath
    cleanContent = cleanContent.replace(/\\Js\b/g, '\\text{J s}');
    cleanContent = cleanContent.replace(/\\J\b/g, '\\text{J}');
    cleanContent = cleanContent.replace(/\\Hz\b/g, '\\text{Hz}');
    cleanContent = cleanContent.replace(/\\eV\b/g, '\\text{eV}');
    cleanContent = cleanContent.replace(/\\nm\b/g, '\\text{nm}');
    cleanContent = cleanContent.replace(/\\cm\b/g, '\\text{cm}');
    cleanContent = cleanContent.replace(/\\mm\b/g, '\\text{mm}');
    cleanContent = cleanContent.replace(/\\km\b/g, '\\text{km}');
    cleanContent = cleanContent.replace(/\\m\b/g, '\\text{m}');
    cleanContent = cleanContent.replace(/\\s\b/g, '\\text{s}');
    cleanContent = cleanContent.replace(/\\kg\b/g, '\\text{kg}');
    cleanContent = cleanContent.replace(/\\mol\b/g, '\\text{mol}');
    cleanContent = cleanContent.replace(/\\K\b/g, '\\text{K}');
    cleanContent = cleanContent.replace(/\\W\b/g, '\\text{W}');
    cleanContent = cleanContent.replace(/\\V\b/g, '\\text{V}');
    cleanContent = cleanContent.replace(/\\A\b/g, '\\text{A}');
    cleanContent = cleanContent.replace(/\\N\b/g, '\\text{N}');
    cleanContent = cleanContent.replace(/\\Pa\b/g, '\\text{Pa}');
    
    // Catch common "infinitesimal" hallucinated commands that crash the renderer
    cleanContent = cleanContent.replace(/\\dx\b/g, 'd x');
    cleanContent = cleanContent.replace(/\\dt\b/g, 'd t');
    cleanContent = cleanContent.replace(/\\dv\b/g, 'd v');
    cleanContent = cleanContent.replace(/\\du\b/g, 'd u');
    cleanContent = cleanContent.replace(/\\dy\b/g, 'd y');
    cleanContent = cleanContent.replace(/\\dz\b/g, 'd z');
    
    // Catch common chemistry/physics arrow hallucinations
    cleanContent = cleanContent.replace(/\\rightleftharpoons\b/g, '\\rightleftharpoons'); // Ensure it's literal
    cleanContent = cleanContent.replace(/\\longleftrightarrow\b/g, '\\longleftrightarrow');
    cleanContent = cleanContent.replace(/\\leftrightarrow\b/g, '\\leftrightarrow');
    // If AI hallucinates "leftharppon" as reported by user
    cleanContent = cleanContent.replace(/\\right[\s]*leftharppon/g, '\\rightleftharpoons');
    cleanContent = cleanContent.replace(/\\rightleftharpoon/g, '\\rightleftharpoons');

    // Fix \hbar (common QM symbol) - this IS a valid LaTeX command, keep it
    // But strip tabular/array commands that crash the renderer
    cleanContent = cleanContent.replace(/\\begin{tabular}[\s\S]*?\\end{tabular}/g, '');
    cleanContent = cleanContent.replace(/\\begin{array}[\s\S]*?\\end{array}/g, '');
    cleanContent = cleanContent.replace(/\\hline/g, '');
    cleanContent = cleanContent.replace(/\\cline{[^}]*}/g, '');
    cleanContent = cleanContent.replace(/\\multicolumn{[^}]*}{[^}]*}{[^}]*}/g, '');
    cleanContent = cleanContent.replace(/\\newline/g, ' ');
    cleanContent = cleanContent.replace(/\\arraystretch/g, '');
    cleanContent = cleanContent.replace(/\\toprule/g, '');
    cleanContent = cleanContent.replace(/\\midrule/g, '');
    cleanContent = cleanContent.replace(/\\bottomrule/g, '');

    // Catch common Physics macro hallucinated commands (\abs, \ket, \bra, \norm)
    cleanContent = cleanContent.replace(/\\abs{([^}]+)}/g, '|$1|');
    cleanContent = cleanContent.replace(/\\norm{([^}]+)}/g, '\\| $1 \\|');
    cleanContent = cleanContent.replace(/\\ket{([^}]+)}/g, '|$1\\rangle');
    cleanContent = cleanContent.replace(/\\bra{([^}]+)}/g, '\\langle $1|');
    cleanContent = cleanContent.replace(/\\braket{([^}]+)}{([^}]+)}/g, '\\langle $1 | $2 \\rangle');
    cleanContent = cleanContent.replace(/\\braket{([^}]+)}/g, '\\langle $1 \\rangle');
    
    // Sometimes the AI uses \lvert and \rVert from amsmath instead of |
    cleanContent = cleanContent.replace(/\\lvert/g, '|');
    cleanContent = cleanContent.replace(/\\rvert/g, '|');
    cleanContent = cleanContent.replace(/\\lVert/g, '\\|');
    cleanContent = cleanContent.replace(/\\rVert/g, '\\|');

    // Fix unbalanced \left / \right pairs inside math blocks
    // This prevents "missing \right" or "missing \left" crashes
    cleanContent = cleanContent.replace(/(\${1,2})([\s\S]*?)(\${1,2})/g, (match, open, mathContent, close) => {
        const leftCount = (mathContent.match(/\\left[\s]*[(\[{|.\\]/g) || []).length;
        const rightCount = (mathContent.match(/\\right[\s]*[)\]}|.\\]/g) || []).length;
        
        let fixed = mathContent;
        if (leftCount > rightCount) {
            // Add missing \right. for each unmatched \left
            for (let i = 0; i < leftCount - rightCount; i++) {
                fixed += ' \\right.';
            }
        } else if (rightCount > leftCount) {
            // Add missing \left. for each unmatched \right
            for (let i = 0; i < rightCount - leftCount; i++) {
                fixed = '\\left. ' + fixed;
            }
        }
        return open + fixed + close;
    });

    return (
        <View style={styles.container}>
            <EnrichedMarkdownText
                markdown={cleanContent}
                flavor="github"
                markdownStyle={{
                    paragraph: {
                        fontSize: fontSize,
                        color: color,
                        fontFamily: 'FKGrotesk-Regular',
                        lineHeight: Math.round(fontSize * 1.6),
                        marginBottom: 4,
                    },
                    list: {
                        fontSize: fontSize,
                        color: color,
                        fontFamily: 'FKGrotesk-Regular',
                        marginBottom: 4,
                    },
                    strong: {
                        fontFamily: 'FKGrotesk-Medium',
                    },
                    math: {
                        fontSize: fontSize,
                        color: color,
                        marginTop: 4,
                        marginBottom: 4,
                    },
                    inlineMath: {
                        color: color,
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    }
});
