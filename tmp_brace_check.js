const fs = require('fs');
const text = fs.readFileSync('components/EigoMaster.tsx', 'utf8');
const lines = text.split(/\r?\n/);
let stack = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const ch = line[j];
    if ('({['.includes(ch)) stack.push({ch, i: i + 1, j: j + 1});
    if (')}]'.includes(ch)) {
      const last = stack.pop();
      if (!last) {
        console.log('unmatched close', ch, i + 1, j + 1);
        process.exit(1);
      }
      const pair = {'(': ')', '{': '}', '[': ']'};
      if (pair[last.ch] !== ch) {
        console.log('mismatch', last, ch, 'at', i + 1, j + 1);
        process.exit(1);
      }
    }
  }
}
if (stack.length) {
  console.log('unclosed count', stack.length);
  console.log(stack.slice(-10));
  process.exit(1);
}
console.log('all balanced');
