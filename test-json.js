const json = '{"test": "foo \\lambda bar"}'; 
console.log('Original JSON string:', json);

try {
  JSON.parse(json);
  console.log('Original parsed ok!');
} catch (e) {
  console.log('Original Parse ERROR:', e.message);
}

const fixed = json.replace(/\\([^"\\/bfnrtu])/g, '\\\\$1'); 
console.log('Fixed JSON string:', fixed);

try {
  console.log('Fixed parse result:', JSON.parse(fixed));
} catch(e) {
  console.log('Fixed Parse ERROR:', e.message);
}

