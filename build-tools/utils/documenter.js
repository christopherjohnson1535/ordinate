// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('node:path');
const ts = require('typescript');
const { rootDir, toPascalCase } = require('./index');

// Where a package's component folders live, and the tsconfig that compiles them.
const componentsSource = { srcDir: path.join(rootDir, 'src'), tsconfig: path.join(rootDir, 'tsconfig.json') };
const chartsSource = { srcDir: path.join(rootDir, 'charts/src'), tsconfig: path.join(rootDir, 'charts/tsconfig.json') };

/**
 * One program for every component, so inherited props such as `id` resolve across files.
 */
function createProgram(folders, source = componentsSource) {
  const { options } = ts.getParsedCommandLineOfConfigFile(source.tsconfig, {}, ts.sys);
  const files = folders.flatMap(folder =>
    ['interfaces.ts', 'index.tsx'].map(file => path.join(source.srcDir, folder, file))
  );
  return ts.createProgram(files, options);
}

function findStatement(sourceFile, kind, name) {
  return sourceFile.statements.find(statement => statement.kind === kind && statement.name?.text === name);
}

function findNamespaceMember(sourceFile, namespace, name) {
  const declaration = findStatement(sourceFile, ts.SyntaxKind.ModuleDeclaration, namespace);
  return declaration?.body?.statements?.find(statement => statement.name?.text === name);
}

function describe(symbol, checker) {
  return ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
}

function typeText(declaration, symbol, checker) {
  if (declaration?.type) {
    return declaration.type.getText().replace(/\s+/g, ' ');
  }
  return checker.typeToString(checker.getTypeOfSymbol(symbol));
}

/**
 * The allowed values of a prop whose type is a union of string or number literals.
 */
function literalValues(symbol, checker) {
  const type = checker.getNonNullableType(checker.getTypeOfSymbol(symbol));
  const parts = type.isUnion() ? type.types : [type];
  const isLiteral = part => part.isStringLiteral() || part.isNumberLiteral();
  return parts.every(isLiteral) ? parts.map(part => String(part.value)) : undefined;
}

const documentedDefault = /Defaults to (`[^`]+`|"[^"]+"|-?\d+(?:\.\d+)?)\.(?:\s|$)/;

function defaultFromDocs(symbol, description) {
  const tag = symbol.getJsDocTags().find(({ name }) => name === 'default');
  if (tag) {
    return ts.displayPartsToString(tag.text).trim();
  }
  const match = description.match(documentedDefault);
  return match?.[1].replace(/^[`"]|[`"]$/g, '');
}

/**
 * The text of a default value. A reference to a constant in the same file, such as
 * `fallbackPanelSize`, is replaced with the constant's value.
 */
function initializerText(initializer) {
  if (!ts.isIdentifier(initializer)) {
    return initializer.getText();
  }
  let value;
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === initializer.text && node.initializer) {
      value = node.initializer.getText();
    }
    ts.forEachChild(node, visit);
  };
  visit(initializer.getSourceFile());
  return value ?? initializer.getText();
}

/**
 * Default values written in the destructuring of the component's props, such as
 * `variant = 'normal'`, from the public component and then its internal one.
 */
function collectDestructuringDefaults(program, folder, srcDir) {
  const pascal = toPascalCase(folder);
  const propsType = new RegExp(`^(Internal)?${pascal}Props$`);
  const defaults = new Map();
  for (const file of ['index.tsx', 'internal.tsx']) {
    const sourceFile = program.getSourceFile(path.join(srcDir, folder, file));
    if (!sourceFile) {
      continue;
    }
    const visit = node => {
      if (ts.isParameter(node) && ts.isObjectBindingPattern(node.name) && propsType.test(node.type?.getText() ?? '')) {
        for (const element of node.name.elements) {
          const name = (element.propertyName ?? element.name).getText();
          if (element.initializer && !defaults.has(name)) {
            defaults.set(name, initializerText(element.initializer));
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return defaults;
}

function isRegion(declaration, type) {
  return /ReactNode/.test(type) && !(declaration?.type && ts.isFunctionTypeNode(declaration.type));
}

function isEvent(name, type) {
  return /^on[A-Z]/.test(name) && /EventHandler\b/.test(type);
}

function eventDetail(declaration) {
  const argument = declaration?.type?.typeArguments?.[0];
  return argument ? argument.getText() : 'null';
}

function documentProperty(symbol, checker, defaults) {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  const name = symbol.getName();
  const type = typeText(declaration, symbol, checker);
  const description = describe(symbol, checker);
  const optional = (symbol.flags & ts.SymbolFlags.Optional) !== 0;

  if (isEvent(name, type)) {
    return {
      kind: 'events',
      entry: {
        name,
        description,
        detailType: eventDetail(declaration),
        cancelable: /^Cancelable/.test(type),
      },
    };
  }
  if (isRegion(declaration, type)) {
    return { kind: 'regions', entry: { name, description, isDefault: name === 'children' } };
  }
  const defaultValue = defaultFromDocs(symbol, description) ?? defaults.get(name);
  const values = literalValues(symbol, checker);
  return {
    kind: 'properties',
    entry: {
      name,
      type,
      optional,
      description,
      ...(defaultValue !== undefined && { defaultValue }),
      ...(values && { values }),
    },
  };
}

function documentFunction(member, checker) {
  const symbol = checker.getSymbolAtLocation(member.name);
  const signature = ts.isMethodSignature(member) ? member : member.type;
  return {
    name: member.name.getText(),
    description: symbol ? describe(symbol, checker) : '',
    parameters: (signature?.parameters ?? []).map(parameter => ({
      name: parameter.name.getText(),
      type: parameter.type ? parameter.type.getText() : 'unknown',
    })),
    returnType: signature?.type ? signature.type.getText() : 'void',
  };
}

const byName = (a, b) => a.name.localeCompare(b.name);

/**
 * The definition of one component: its props split into properties, regions and events, and the
 * functions of its `Ref`. Returns `null` when the folder declares no `<Name>Props` interface.
 */
function documentComponent(program, folder, source = componentsSource) {
  const { srcDir } = source;
  const checker = program.getTypeChecker();
  const name = toPascalCase(folder);
  const sourceFile = program.getSourceFile(path.join(srcDir, folder, 'interfaces.ts'));
  const propsInterface = sourceFile && findStatement(sourceFile, ts.SyntaxKind.InterfaceDeclaration, `${name}Props`);
  if (!propsInterface) {
    return null;
  }

  const defaults = collectDestructuringDefaults(program, folder, srcDir);
  const propsType = checker.getTypeAtLocation(propsInterface.name);
  const definition = { name, folder, properties: [], regions: [], events: [], functions: [] };
  for (const symbol of checker.getPropertiesOfType(propsType)) {
    const { kind, entry } = documentProperty(symbol, checker, defaults);
    definition[kind].push(entry);
  }

  const ref = findNamespaceMember(sourceFile, `${name}Props`, 'Ref');
  definition.functions = (ref?.members ?? []).map(member => documentFunction(member, checker));

  for (const list of ['properties', 'regions', 'events', 'functions']) {
    definition[list].sort(byName);
  }
  return definition;
}

module.exports = { chartsSource, componentsSource, createProgram, documentComponent };
