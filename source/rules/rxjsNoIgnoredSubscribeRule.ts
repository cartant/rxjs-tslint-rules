/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { couldBeType, isReferenceType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      "Disallows the calling of subscribe without specifying arguments.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-ignored-subscribe",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING =
    "Calling subscribe without arguments is forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions(), program)
    );
  }
}

export class Walker extends Lint.ProgramAwareRuleWalker {
  protected visitCallExpression(node: ts.CallExpression): void {
    const { expression } = node;
    if (tsutils.isPropertyAccessExpression(expression)) {
      const name = expression.name.getText();
      const typeChecker = this.getTypeChecker();
      const type = typeChecker.getTypeAtLocation(expression.expression);

      if (
        name === "subscribe" &&
        isReferenceType(type) &&
        couldBeType(type, "Observable") &&
        node.arguments.length === 0
      ) {
        this.addFailureAtNode(expression.name, Rule.FAILURE_STRING);
      }
    }

    super.visitCallExpression(node);
  }
}
