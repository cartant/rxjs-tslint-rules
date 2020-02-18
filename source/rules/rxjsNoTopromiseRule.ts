/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import * as peer from "../support/peer";

import { tsquery } from "@phenomnomnominal/tsquery";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v6OnlyMessage : undefined,
    description: "Disallows calling toPromise.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-topromise",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "toPromise is forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const propertyAccessExpressions = tsquery(
      sourceFile,
      `PropertyAccessExpression[name.name="toPromise"]`
    ) as ts.PropertyAccessExpression[];
    propertyAccessExpressions.forEach(propertyAccessExpression => {
      const type = typeChecker.getTypeAtLocation(
        propertyAccessExpression.expression
      );
      if (couldBeType(type, "Observable")) {
        const { name } = propertyAccessExpression;
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
    });

    return failures;
  }
}
