const testCases = [
  '{"test": "foo \\lambda bar"}',
  '{"test": "foo \\\\lambda bar"}',
  '{"test": "foo \\ bar"}',
  '{"test": "foo \\" bar"}',
  '{"test": "foo \\\n bar"}',
  '{"test": "foo \\textbf{bar}"}',
  '{"test": "foo \\"}', // invalid on purpose
  '{"test": "foo \\"', // trailing
  '{ "test": "\\\\Delta" }',
];

function sanitizeJSON(jsonStr) {
    let sanitized = "";
    for (let i = 0; i < jsonStr.length; i++) {
        if (jsonStr[i] === '\\') {
            if (i + 1 < jsonStr.length) {
                const nextChar = jsonStr[i + 1];
                if (['"', '\\', '/', 'b', 'f', 'n', 'r', 't', 'u'].includes(nextChar)) {
                    // Valid JSON escape sequence
                    sanitized += '\\' + nextChar;
                    i++; // skip the next char
                } else {
                    // Invalid escape sequence, escape the backslash
                    sanitized += '\\\\';
                }
            } else {
                sanitized += '\\\\';
            }
        } else if (jsonStr[i] === '\n') {
            sanitized += '\\n';
        } else if (jsonStr[i] === '\r') {
            sanitized += '\\r';
        } else if (jsonStr[i] === '\t') {
            sanitized += '\\t';
        } else {
            sanitized += jsonStr[i];
        }
    }
    return sanitized;
}

for (let json of testCases) {
  let fixed = sanitizeJSON(json);
  console.log('Original::', json);
  console.log('Fixed   ::', fixed);
  try {
    JSON.parse(fixed);
    console.log('Parse OK');
  } catch(e) {
    console.log('Parse ERROR:', e.message);
  }
  console.log('---');
}
