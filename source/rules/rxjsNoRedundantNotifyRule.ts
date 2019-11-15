/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import { couldBeType } from "../support/util";

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
    const typeChecker = program.getTypeChecker();
    const query = `ExpressionStatement[expression.expression.name.text=/^(complete|error)$/] ~ ExpressionStatement[expression.expression.name.text=/^(next|complete|error)$/]`;
    const expressionStatements = tsquery(sourceFile, query);
    expressionStatements.forEach((node: ts.ExpressionStatement) => {
      const { parent } = node;
      if (!ts.isBlock(parent)) {
        return;
      }
      const { statements } = parent;
      const index = statements.indexOf(node);
      const sibling = statements[index - 1] as ts.ExpressionStatement;
      if (
        !isExpressionObserver(sibling, typeChecker) ||
        !isExpressionObserver(node, typeChecker)
      ) {
        return;
      }
      if (getExpressionText(sibling) !== getExpressionText(node)) {
        return;
      }
      const expressionStatement = node;
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

function getExpressionText(
  expressionStatement: ts.ExpressionStatement
): string | undefined {
  if (!ts.isCallExpression(expressionStatement.expression)) {
    return undefined;
  }
  const callExpression = expressionStatement.expression;
  if (!ts.isPropertyAccessExpression(callExpression.expression)) {
    return undefined;
  }
  const { expression } = callExpression.expression;
  return expression.getText();
}

function isExpressionObserver(
  expressionStatement: ts.ExpressionStatement,
  typeChecker: ts.TypeChecker
): boolean {
  if (!ts.isCallExpression(expressionStatement.expression)) {
    return false;
  }
  const callExpression = expressionStatement.expression;
  if (!ts.isPropertyAccessExpression(callExpression.expression)) {
    return false;
  }
  const { expression } = callExpression.expression;
  const type = typeChecker.getTypeAtLocation(expression);
  return couldBeType(type, /^(Subject|Subscriber)$/);
}
