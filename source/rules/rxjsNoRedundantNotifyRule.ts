/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      "Disallows redundant notifications from completed or errored observables.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-redundant-notify",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Redundant notifications are forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const query = `ExpressionStatement[expression.expression.name.text=/^(complete|error)$/] ~ ExpressionStatement[expression.expression.name.text=/^(next|complete|error)$/]`;
    const expressionStatements = tsquery(sourceFile, query);
    expressionStatements.forEach(node => {
      const expressionStatement = node as ts.ExpressionStatement;
      if (ts.isCallExpression(expressionStatement.expression)) {
        const callExpression = expressionStatement.expression;
        if (ts.isPropertyAccessExpression(callExpression.expression)) {
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
