/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    description: "Disallows passing Boolean as a predicate or projector.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: false,
    ruleName: "rxjs-no-boolean",
    type: "functionality",
    typescriptOnly: false
  };

  public static FAILURE_STRING =
    "Using Boolean as a predicate or projector is forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];

    const callExpressions = tsquery(
      sourceFile,
      `CallExpression[expression.name.text="pipe"] > CallExpression[expression.text=/^(filter|find|first|last|map|skipWhile|takeWhile)$/]`
    ) as ts.CallExpression[];
    callExpressions.forEach(callExpression => {
      const [arg] = callExpression.arguments;
      if (arg && ts.isIdentifier(arg) && arg.text === "Boolean") {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            arg.getStart(),
            arg.getStart() + arg.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      }
    });
    return failures;
  }
}
