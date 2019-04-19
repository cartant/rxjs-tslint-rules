/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import { tsquery } from "@phenomnomnominal/tsquery";
import { couldBeFunction } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: "Disallows operators that return connectable observables.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: false,
    ruleName: "rxjs-no-connectable",
    type: "functionality",
    typescriptOnly: false
  };

  public static FAILURE_STRING = "Connectable observables are forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const callIdentifiers = tsquery(
      sourceFile,
      `CallExpression Identifier[name=/^(multicast|publish|publishBehavior|publishLast|publishReplay)$/]`
    );
    callIdentifiers.forEach(identifier => {
      const callExpression = identifier.parent as ts.CallExpression;
      let fail = false;
      if (identifier.getText() === "multicast") {
        fail = callExpression.arguments.length === 1;
      } else {
        fail = !callExpression.arguments.some(arg =>
          couldBeFunction(typeChecker.getTypeAtLocation(arg))
        );
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
