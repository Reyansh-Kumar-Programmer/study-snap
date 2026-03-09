const testCases = [
  '{"test": "foo \\lambda bar"}',
  '{"test": "foo \\\\lambda bar"}',
  '{"test": "foo \\ bar"}',
  '{"test": "foo \\" bar"}',
  '{"test": "foo \\\n bar"}',
  '{"test": "foo \\textbf{bar}"}',
];

for (let json of testCases) {
  let fixed = json.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
  fixed = fixed.replace(/\\\\|\\([^"\\/bfnrtu])/g, (match, p1) => {
      return p1 ? '\\\\' + p1 : match;
  });
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
