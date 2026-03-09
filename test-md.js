const MarkdownIt = require('markdown-it');

const mathPlugin = (md) => {
    md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
        if (state.src.charCodeAt(state.pos) !== 0x24 /* $ */) return false;

        let end = -1;
        for (let i = state.pos + 1; i < state.posMax; i++) {
            if (state.src.charCodeAt(i) === 0x5C /* \ */) { i++; continue; }
            if (state.src.charCodeAt(i) === 0x24 /* $ */) {
                end = i;
                break;
            }
        }
        if (end === -1) return false;

        if (!silent) {
            const token = state.push('math_inline', 'math', 0);
            token.content = state.src.slice(state.pos + 1, end).trim();
            token.markup = '$';
        }
        state.pos = end + 1;
        return true;
    });

    md.block.ruler.after('blockquote', 'math_block', (state, startLine, endLine, silent) => {
        let pos = state.bMarks[startLine] + state.tShift[startLine];
        let max = state.eMarks[startLine];
        if (pos + 1 >= max) return false;
        if (state.src.charCodeAt(pos) !== 0x24 || state.src.charCodeAt(pos + 1) !== 0x24) return false;

        let nextLine = startLine;
        while (nextLine < endLine) {
            nextLine++;
            if (nextLine >= endLine) break;
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            if (pos < max && state.tShift[nextLine] < state.blkIndent) break;
            if (state.src.slice(pos, max).includes('$$')) break;
        }

        if (!silent) {
            const token = state.push('math_block', 'math', 0);
            const content = state.getLines(startLine, nextLine + 1, state.blkIndent, false);
            token.content = content.replace(/^\s*\$\$/, '').replace(/\$\$\s*$/, '').trim();
            token.map = [startLine, nextLine + 1];
            token.markup = '$$';
        }

        state.line = nextLine + 1;
        return true;
    });
};

const md = new MarkdownIt({ typographer: true }).use(mathPlugin);

const tokens = md.parse("Hello **bold** and *italic* and $x^2$.");
console.log(JSON.stringify(tokens, null, 2));

const tokens2 = md.parse("Hello **bold**");
console.log(JSON.stringify(tokens2, null, 2));
