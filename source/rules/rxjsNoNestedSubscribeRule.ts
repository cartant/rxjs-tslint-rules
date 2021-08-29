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
    description:
      "Disallows the calling of `subscribe` within a `subscribe` callback.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-nested-subscribe",
    type: "style",
    typescriptOnly: true,
  };

  public static FAILURE_STRING = "Nested subscribe calls are forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const subscribeQuery = `CallExpression > PropertyAccessExpression[name.name="subscribe"]`;
    const propertyAccessExpressions = tsquery(sourceFile, subscribeQuery);
    propertyAccessExpressions.forEach((node) => {
      const propertyAccessExpression = node as ts.PropertyAccessExpression;
      const { parent: callExpression } = propertyAccessExpression;
      if (tsutils.isCallExpression(callExpression)) {
        const type = typeChecker.getTypeAtLocation(
          propertyAccessExpression.expression
        );
        if (couldBeType(type, "Observable")) {
          callExpression.arguments.forEach((arg) => {
            const innerPropertyAccessExpressions = tsquery(arg, subscribeQuery);
            innerPropertyAccessExpressions.forEach((node) => {
              const innerPropertyAccessExpression =
                node as ts.PropertyAccessExpression;
              if (innerPropertyAccessExpression !== propertyAccessExpression) {
                const type = typeChecker.getTypeAtLocation(
                  innerPropertyAccessExpression.expression
                );
                if (couldBeType(type, "Observable")) {
                  const { name } = innerPropertyAccessExpression;
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
          });
        }
      }
    });
    return failures;
  }
}
