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
    description: "Disallows the ignoring of observables returned by functions.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-ignored-observable",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Ignoring a returned Observable is forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const callExpressions = tsquery(
      sourceFile,
      `ExpressionStatement > CallExpression`
    );
    callExpressions.forEach(callExpression => {
      const type = typeChecker.getTypeAtLocation(callExpression);
      if (couldBeType(type, "Observable")) {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            callExpression.getStart(),
            callExpression.getStart() + callExpression.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      }
    });
    return failures;
  }
}
