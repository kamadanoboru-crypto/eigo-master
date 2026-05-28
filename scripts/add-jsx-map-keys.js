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

function isMapCall(path) {
  const callee = path.node.callee;
  return t.isMemberExpression(callee) && t.isIdentifier(callee.property, { name: 'map' });
}

function hasKeyAttr(openingElement) {
  return openingElement.attributes.some((attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: 'key' }));
}

function keyExpression(indexName, fallbackName) {
  return t.logicalExpression(
    '??',
    fallbackName
      ? t.optionalMemberExpression(t.identifier(fallbackName), t.identifier('id'), false, true)
      : t.nullLiteral(),
    t.identifier(indexName)
  );
}

function ensureIndexParam(fnPath) {
  const fn = fnPath.node;
  if (!fn.params[1]) fn.params.push(t.identifier('__idx'));
  if (t.isIdentifier(fn.params[1])) return fn.params[1].name;
  return '__idx';
}

function firstParamName(fnPath) {
  const first = fnPath.node.params[0];
  return t.isIdentifier(first) ? first.name : null;
}

for (const file of files) {
  const ast = parser.parse(fs.readFileSync(file, 'utf8'), {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  traverse(ast, {
    CallExpression(path) {
      if (!isMapCall(path)) return;
      const fnPath = path.get('arguments.0');
      if (!fnPath || !(fnPath.isArrowFunctionExpression() || fnPath.isFunctionExpression())) return;
      const indexName = ensureIndexParam(fnPath);
      const fallbackName = firstParamName(fnPath);

      fnPath.traverse({
        JSXElement(jsxPath) {
          if (hasKeyAttr(jsxPath.node.openingElement)) return;
          jsxPath.node.openingElement.attributes.unshift(
            t.jsxAttribute(t.jsxIdentifier('key'), t.jsxExpressionContainer(keyExpression(indexName, fallbackName)))
          );
        },
        JSXFragment(fragmentPath) {
          fragmentPath.replaceWith(t.jsxElement(
            t.jsxOpeningElement(
              t.jsxMemberExpression(t.jsxIdentifier('React'), t.jsxIdentifier('Fragment')),
              [t.jsxAttribute(t.jsxIdentifier('key'), t.jsxExpressionContainer(keyExpression(indexName, fallbackName)))],
              false
            ),
            t.jsxClosingElement(t.jsxMemberExpression(t.jsxIdentifier('React'), t.jsxIdentifier('Fragment'))),
            fragmentPath.node.children,
            false
          ));
        },
      });
    },
  });

  let output = generate(ast, { jsescOption: { minimal: true } }).code;
  output = output.replace(/\/\* eslint-disable react\/jsx-key \*\/\n?/g, '');
  fs.writeFileSync(file, output + '\n', 'utf8');
  console.log(`keyed ${file}`);
}
