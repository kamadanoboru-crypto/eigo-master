const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const files = [
  'components/EigoMaster.tsx',
  'components/eigoMaster/core.tsx',
  'components/eigoMaster/studyViews.tsx',
  'components/eigoMaster/mediaViews.tsx',
  'components/eigoMaster/socialViews.tsx',
];

function jsxNameFromCalleeArg(node) {
  if (t.isStringLiteral(node)) return t.jsxIdentifier(node.value);
  if (t.isIdentifier(node)) return t.jsxIdentifier(node.name);
  if (t.isMemberExpression(node)) {
    return t.jsxMemberExpression(
      jsxNameFromCalleeArg(node.object),
      jsxNameFromCalleeArg(node.property)
    );
  }
  return t.jsxIdentifier('Unknown');
}

function attrNameFromKey(key) {
  if (t.isIdentifier(key)) return t.jsxIdentifier(key.name);
  if (t.isStringLiteral(key)) return t.jsxIdentifier(key.value);
  return t.jsxIdentifier('unknown');
}

function attrValueFromNode(node) {
  if (t.isStringLiteral(node)) return t.stringLiteral(node.value);
  return t.jsxExpressionContainer(node);
}

function childFromNode(node) {
  if (t.isStringLiteral(node)) return t.jsxText(node.value);
  if (t.isJSXElement(node) || t.isJSXFragment(node)) return node;
  if (t.isNullLiteral(node)) return null;
  return t.jsxExpressionContainer(node);
}

function childrenFromProp(value) {
  if (!value) return [];
  if (t.isArrayExpression(value)) {
    return value.elements.map((child) => child && childFromNode(child)).filter(Boolean);
  }
  const child = childFromNode(value);
  return child ? [child] : [];
}

function convertJsxRuntimeCall(path) {
  const call = path.node;
  if (!t.isIdentifier(call.callee) || !['_jsx', '_jsxs'].includes(call.callee.name)) return;
  const [tagArg, propsArg] = call.arguments;
  if (!tagArg) return;

  if (t.isIdentifier(tagArg, { name: '_Fragment' })) {
    const children = t.isObjectExpression(propsArg)
      ? childrenFromProp((propsArg.properties.find((prop) =>
          t.isObjectProperty(prop) &&
          ((t.isIdentifier(prop.key) && prop.key.name === 'children') ||
            (t.isStringLiteral(prop.key) && prop.key.value === 'children'))
        ) || {}).value)
      : [];
    path.replaceWith(t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), children));
    return;
  }

  const name = jsxNameFromCalleeArg(tagArg);
  const attrs = [];
  let children = [];

  if (t.isObjectExpression(propsArg)) {
    for (const prop of propsArg.properties) {
      if (t.isSpreadElement(prop)) {
        attrs.push(t.jsxSpreadAttribute(prop.argument));
        continue;
      }
      if (!t.isObjectProperty(prop)) continue;
      const isChildren =
        (t.isIdentifier(prop.key) && prop.key.name === 'children') ||
        (t.isStringLiteral(prop.key) && prop.key.value === 'children');
      if (isChildren) {
        children = childrenFromProp(prop.value);
        continue;
      }
      attrs.push(t.jsxAttribute(attrNameFromKey(prop.key), attrValueFromNode(prop.value)));
    }
  } else if (propsArg && !t.isNullLiteral(propsArg)) {
    attrs.push(t.jsxSpreadAttribute(propsArg));
  }

  const opening = t.jsxOpeningElement(name, attrs, children.length === 0);
  const closing = children.length === 0 ? null : t.jsxClosingElement(name);
  path.replaceWith(t.jsxElement(opening, closing, children, children.length === 0));
}

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  traverse(ast, {
    CallExpression(path) {
      convertJsxRuntimeCall(path);
    },
    ImportDeclaration(path) {
      if (path.node.source.value !== 'react/jsx-runtime') return;
      path.remove();
    },
  });

  const output = generate(ast, {
    jsescOption: { minimal: true },
    retainLines: false,
  }).code;

  fs.writeFileSync(file, output + '\n', 'utf8');
  console.log(`restored ${file}`);
}
