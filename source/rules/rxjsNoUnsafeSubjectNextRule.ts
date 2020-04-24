/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import * as peer from "../support/peer";
import { couldBeType, isReferenceType, isUnionType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description: "Disallows unsafe optional `next` calls.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-unsafe-subject-next",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Unsafe optional next calls are forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const callExpressions = tsquery(
      sourceFile,
      `CallExpression[expression.name.text="next"]`
    );
    callExpressions.forEach(node => {
      const callExpression = node as ts.CallExpression;
      const { arguments: args } = callExpression;
      if (args.length === 0) {
        if (tsutils.isPropertyAccessExpression(callExpression.expression)) {
          const { expression, name } = callExpression.expression;
          const type = typeChecker.getTypeAtLocation(expression);
          if (isReferenceType(type) && couldBeType(type, "Subject")) {
            const [typeArg] = typeChecker.getTypeArguments(type);
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Any)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Unknown)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Void)) {
              return;
            }
            if (
              isUnionType(typeArg) &&
              typeArg.types.some(t =>
                tsutils.isTypeFlagSet(t, ts.TypeFlags.Void)
              )
            ) {
              return;
            }
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
      }
    });
    return failures;
  }
}
