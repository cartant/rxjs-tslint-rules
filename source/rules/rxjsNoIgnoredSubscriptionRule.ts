/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import * as peer from "../support/peer";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description: "Disallows ignoring the subscription returned by subscribe.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-ignored-subscription",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Ignoring returned subscriptions is forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const callExpressions = tsquery(
      sourceFile,
      `CallExpression[expression.name.text="subscribe"]`
    );
    callExpressions.forEach(node => {
      const callExpression = node as ts.CallExpression;
      if (tsutils.isPropertyAccessExpression(callExpression.expression)) {
        if (!tsutils.isExpressionStatement(callExpression.parent)) {
          return;
        }
        const propertyAccessExpression = callExpression.expression;
        const type = typeChecker.getTypeAtLocation(
          propertyAccessExpression.expression
        );
        if (couldBeType(type, "Observable")) {
          const { name } = callExpression.expression;
          failures.push(
            new Lint.RuleFailure(
              sourceFile,
              name.getStart(),
              name.getStart() + name.getWidth(),
              Rule.FAILURE_STRING,
              this.ruleName
            )
          );
        }
      }
    });
    return failures;
  }
}
