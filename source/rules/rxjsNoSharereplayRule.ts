/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: "Disallows using the `shareReplay` operator.",
    options: {
      properties: {
        allowConfig: { type: "boolean" }
      },
      type: "object"
    },
    optionsDescription: Lint.Utils.dedent`
            An optional object with an optional \`allowConfig\` property.
            If \`allowConfig\` is \`true\`, calls to \`shareReplay\` are allowed if a
            config object is passed - instead of separate parameters`,
    requiresTypeInfo: false,
    ruleName: "rxjs-no-sharereplay",
    type: "functionality",
    typescriptOnly: false
  };

  public static FAILURE_STRING = "shareReplay is forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const {
      ruleArguments: [options]
    } = this.getOptions();
    const allowConfig =
      options && options.hasOwnProperty("allowConfig")
        ? options.allowConfig
        : false;
    const failures: Lint.RuleFailure[] = [];

    const callIdentifiers = tsquery(
      sourceFile,
      `CallExpression Identifier[name="shareReplay"]`
    );
    callIdentifiers.forEach(identifier => {
      let fail = true;
      if (allowConfig) {
        const callExpression = identifier.parent as ts.CallExpression;
        fail =
          callExpression.arguments.length !== 1 ||
          !tsutils.isObjectLiteralExpression(callExpression.arguments[0]);
      }
      if (fail) {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            identifier.getStart(),
            identifier.getStart() + identifier.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      }
    });
    return failures;
  }
}
