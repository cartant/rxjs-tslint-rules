/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { ScopeWalker } from "../support/scope-walker";
import {
  findDeclaration,
  isConstDeclaration,
  isInstanceofCtor,
  isThis,
  isWithinCallExpressionExpression,
  isWithinParameterDeclaration
} from "../support/util";

const knownGlobalRegExp = /^(Array|BigInt|Date|Intl|JSON|Math|Number|Object|Promise|Proxy|Reflect|String|Symbol|console)$/;

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      "Disallows the use of variables/properties from unsafe/outer scopes in operator callbacks.",
    options: {
      properties: {
        allowDo: { type: "boolean" },
        allowMethods: { type: "boolean" },
        allowParameters: { type: "boolean" },
        allowProperties: { type: "boolean" },
        allowSubscribe: { type: "boolean" },
        allowTap: { type: "boolean" }
      },
      type: "object"
    },
    optionsDescription: Lint.Utils.dedent`
      An optional object with optional \`allowDo\`, \`allowParameters\` and \`allowTap\` properties all of which default to \`true\`.
      If the \`allowDo\` and \`allowTap\` options are \`true\`, the rule is not applied within \`do\` and \`tap\` operators respectively.
      If the \`allowParameters\` option is \`true\`, referencing function parameters from outer scopes is allowed.
      If the \`allowMethods\` option is \`true\`, calling methods via \`this\` is allowed.
      If the \`allowProperties\` option is \`true\`, accessing properties via \`this\` is allowed.
      If the \`allowSubscribe\` option is \`true\`, the rule is not applied within \`subscribe\` callbacks.`,
    requiresTypeInfo: true,
    ruleName: "rxjs-no-unsafe-scopes",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Unsafe scopes are forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions(), program)
    );
  }
}

class Walker extends ScopeWalker {
  private allowDo = true;
  private allowMethods = true;
  private allowParameters = true;
  private allowProperties = false;
  private allowSubscribe = true;
  private allowTap = true;

  constructor(
    sourceFile: ts.SourceFile,
    rawOptions: Lint.IOptions,
    program: ts.Program
  ) {
    super(sourceFile, rawOptions, program);

    const [options] = this.getOptions();
    if (options) {
      this.allowDo =
        options.allowDo !== undefined ? options.allowDo : this.allowDo;
      this.allowMethods =
        options.allowMethods !== undefined
          ? options.allowMethods
          : this.allowMethods;
      this.allowParameters =
        options.allowParameters !== undefined
          ? options.allowParameters
          : this.allowParameters;
      this.allowProperties =
        options.allowProperties !== undefined
          ? options.allowProperties
          : this.allowProperties;
      this.allowSubscribe =
        options.allowSubscribe !== undefined
          ? options.allowSubscribe
          : this.allowSubscribe;
      this.allowTap =
        options.allowTap !== undefined ? options.allowTap : this.allowTap;
    }
    this.knownNames = this.allowSubscribe ? {} : { subscribe: true };
  }

  protected visitNode(node: ts.Node): void {
    if (this.callbackStack.length) {
      const validateNode = tsutils.isIdentifier(node) || isThis(node);
      if (validateNode) {
        const failureNode = this.isUnsafe(node);
        if (failureNode) {
          this.addFailureAtNode(failureNode, Rule.FAILURE_STRING);
        }
      }
    }
    super.visitNode(node);
  }

  private isUnsafe(node: ts.Node): ts.Node | undefined {
    const { callbackMap, callbackStack } = this;
    const leafCallback = callbackStack[callbackStack.length - 1];
    const leafOperator = callbackMap.get(leafCallback);
    const rootCallback = callbackStack[0];
    const typeChecker = this.getTypeChecker();

    if (this.allowDo && leafOperator === "do") {
      return undefined;
    }
    if (this.allowTap && leafOperator === "tap") {
      return undefined;
    }

    if (tsutils.isPropertyAccessExpression(node.parent)) {
      if (!isPropertyAccessExpressionLeaf(node)) {
        return undefined;
      }

      const declaration = findDeclaration(node, typeChecker);
      if (!declaration) {
        return undefined;
      }
      if (
        tsutils.hasModifier(
          declaration.modifiers,
          ts.SyntaxKind.ReadonlyKeyword
        )
      ) {
        return undefined;
      }
      if (
        tsutils.isTypeFlagSet(
          typeChecker.getTypeAtLocation(node),
          ts.TypeFlags.EnumLiteral
        )
      ) {
        return undefined;
      }

      const called = isWithinCallExpressionExpression(node);
      const root = getPropertyAccessExpressionRoot(node.parent);
      if (!root) {
        return undefined;
      }

      if (isThis(root)) {
        if (called) {
          return this.allowMethods ? undefined : root;
        } else {
          return this.allowProperties ? undefined : root;
        }
      }

      const rootText = root.getText();
      if (knownGlobalRegExp.test(rootText)) {
        return undefined;
      }
      if (/^[A-Z]/.test(rootText)) {
        if (called) {
          return this.allowMethods ? undefined : root;
        } else {
          return this.allowProperties ? undefined : root;
        }
      }
      return this.isUnsafeRoot(root, rootCallback);
    }
    return this.isUnsafeRoot(node, rootCallback);
  }

  private isUnsafeRoot(node: ts.Node, callback: ts.Node): ts.Node | undefined {
    const typeChecker = this.getTypeChecker();

    if (ts.isQualifiedName(node.parent)) {
      return undefined;
    }

    if (isInstanceofCtor(node)) {
      return undefined;
    }

    const declaration = findDeclaration(node, typeChecker);
    if (!declaration) {
      return undefined;
    }

    if (isWithinClosure(declaration, callback)) {
      return undefined;
    }

    if (this.allowParameters && isWithinParameterDeclaration(declaration)) {
      return undefined;
    }

    if (
      tsutils.isCallExpression(node.parent) &&
      node === node.parent.expression
    ) {
      return undefined;
    }

    if (
      tsutils.isTaggedTemplateExpression(node.parent) &&
      node === node.parent.tag
    ) {
      return undefined;
    }

    if (tsutils.isNewExpression(node.parent)) {
      return undefined;
    }

    if (tsutils.isTypeReferenceNode(node.parent)) {
      return undefined;
    }

    if (isConstDeclaration(declaration)) {
      return undefined;
    }

    if (tsutils.isImportSpecifier(declaration)) {
      return undefined;
    }

    if (tsutils.isNamespaceImport(declaration)) {
      return undefined;
    }
    return node;
  }
}

function getPropertyAccessExpressionRoot(
  node: ts.PropertyAccessExpression
): ts.Node | undefined {
  let { expression } = node;
  while (tsutils.isPropertyAccessExpression(expression)) {
    expression = expression.expression;
  }
  return isThis(expression) || tsutils.isIdentifier(expression)
    ? expression
    : undefined;
}

function isWithinClosure(
  declaration: ts.Declaration,
  callback: ts.Node
): boolean {
  return declaration.pos >= callback.pos && declaration.pos < callback.end;
}

function isPropertyAccessExpressionLeaf(node: ts.Node): boolean {
  const { parent } = node;
  if (!tsutils.isPropertyAccessExpression(parent)) {
    return false;
  }
  if (node !== parent.name) {
    return false;
  }
  return !tsutils.isPropertyAccessExpression(parent.parent);
}
