/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { ScopeWalker } from "../support/scope-walker";
import { isConstDeclaration, isThis } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: "Use rxjs-no-ignored-takewhile instead.",
    description:
      "Disallows the use of variables/properties from outer scopes in takeWhile.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-unsafe-takewhile",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Outer scopes are forbidden in takeWhile";

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
  protected visitNode(node: ts.Node): void {
    if (this.callbackStack.length) {
      const validateNode = tsutils.isIdentifier(node) || isThis(node);
      if (validateNode && this.isUnsafe(node)) {
        this.addFailureAtNode(node, Rule.FAILURE_STRING);
      }
    }
    super.visitNode(node);
  }

  private isUnsafe(node: ts.Node): boolean {
    const { callbackStack } = this;
    const rootCallback = callbackStack[0];

    const typeChecker = this.getTypeChecker();
    const symbol = typeChecker.getSymbolAtLocation(node);
    if (!symbol) {
      return false;
    }

    const [declaration] = symbol.getDeclarations();
    if (
      declaration.pos >= rootCallback.pos &&
      declaration.pos < rootCallback.end
    ) {
      return false;
    }

    if (tsutils.isCallExpression(node.parent)) {
      return false;
    }
    if (tsutils.isNewExpression(node.parent)) {
      return false;
    }
    if (tsutils.isPropertyAccessExpression(node.parent)) {
      if (node === node.parent.name) {
        return false;
      } else if (tsutils.isCallExpression(node.parent.parent)) {
        return false;
      }
      const type = typeChecker.getTypeAtLocation(node.parent.name);
      /*tslint:disable-next-line:no-bitwise*/
      if ((type.flags & ts.TypeFlags.EnumLiteral) !== 0) {
        return false;
      }
    }

    if (isConstDeclaration(declaration)) {
      return false;
    }

    if (tsutils.isImportSpecifier(declaration)) {
      return false;
    }

    return true;
  }
}
