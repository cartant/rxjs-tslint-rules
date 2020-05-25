/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import * as peer from "../support/peer";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description: "Disallows the ignoring of the `takeWhile` value.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-ignored-takewhile-value",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Ignoring the takeWhile value is forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];

    const callExpressions = tsquery(
      sourceFile,
      `CallExpression[expression.text="takeWhile"]`
    ) as ts.CallExpression[];
    callExpressions.forEach(callExpression => {
      let fail = false;

      const [arg] = callExpression.arguments;
      if (ts.isArrowFunction(arg) || ts.isFunctionExpression(arg)) {
        const [parameter] = arg.parameters;
        if (parameter) {
          const identifiers = tsquery(
            arg,
            `Identifier[name="${parameter.name.getText()}"]`
          ) as ts.Identifier[];
          fail = identifiers.length < 2;
        } else {
          fail = true;
        }
      }

      if (fail) {
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
