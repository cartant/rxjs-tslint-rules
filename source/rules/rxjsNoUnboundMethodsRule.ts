/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import * as peer from "../support/peer";

import { tsquery } from "@phenomnomnominal/tsquery";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v6OnlyMessage : undefined,
    description: "Disallows the passing of unbound methods.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-unbound-methods",
    type: "maintainability",
    typescriptOnly: true,
  };

  public static FAILURE_STRING = "Unbound methods are forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const propertyAccessExpressions = tsquery(
      sourceFile,
      `CallExpression PropertyAccessExpression[name.name=/^(add|pipe|subscribe)$/]`
    );
    propertyAccessExpressions.forEach((node) => {
      const propertyAccessExpression = node as ts.PropertyAccessExpression;
      const { parent: callExpression } = propertyAccessExpression;
      if (tsutils.isCallExpression(callExpression)) {
        const type = typeChecker.getTypeAtLocation(
          propertyAccessExpression.expression
        );
        if (couldBeType(type, /^(Observable|Subscription)$/)) {
          const { arguments: args } = callExpression;
          const { name } = propertyAccessExpression;
          if (name.getText() === "pipe") {
            args.forEach((arg) => {
              if (tsutils.isCallExpression(arg)) {
                this.validateArgs(
                  arg.arguments,
                  sourceFile,
                  typeChecker,
                  failures
                );
              }
            });
          } else {
            this.validateArgs(args, sourceFile, typeChecker, failures);
          }
        }
      }
    });

    const subscriptionIdentifiers = tsquery(
      sourceFile,
      `NewExpression Identifier[escapedText="Subscription"]`
    );
    subscriptionIdentifiers.forEach((subscriptionIdentifier) => {
      const { parent: newExpression } = subscriptionIdentifier;
      if (tsutils.isNewExpression(newExpression)) {
        this.validateArgs(
          newExpression.arguments,
          sourceFile,
          typeChecker,
          failures
        );
      }
    });

    return failures;
  }

  private validateArgs(
    args: ts.NodeArray<ts.Expression>,
    sourceFile: ts.SourceFile,
    typeChecker: ts.TypeChecker,
    failures: Lint.RuleFailure[]
  ): void {
    args.forEach((arg) => {
      if (tsutils.isPropertyAccessExpression(arg)) {
        const type = typeChecker.getTypeAtLocation(arg);
        if (type.getCallSignatures().length > 0) {
          const thisKeywords = tsquery(arg, `ThisKeyword`);
          if (thisKeywords.length > 0) {
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
        }
      }
    });
  }
}
