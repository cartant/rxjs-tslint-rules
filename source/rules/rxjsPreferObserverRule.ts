/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import * as peer from "../support/peer";
import { couldBeFunction, couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 || peer.compat ? "Rule is v6-only." : undefined,
    description: "Enforces the passing of observers to `subscribe` and `tap`.",
    options: {
      properties: {
        allowNext: { type: "boolean" }
      },
      type: "object"
    },
    optionsDescription: Lint.Utils.dedent`
            An optional object with optional \`allowNext\` property - which defaults to \`true\`.`,
    requiresTypeInfo: true,
    ruleName: "rxjs-prefer-observer",
    type: "style",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Prefer an observer over callbacks";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const propertyAccessExpressions = tsquery(
      sourceFile,
      `CallExpression PropertyAccessExpression[name.name=/^(pipe|subscribe)$/]`
    );
    propertyAccessExpressions.forEach(node => {
      const propertyAccessExpression = node as ts.PropertyAccessExpression;
      const { parent: callExpression } = propertyAccessExpression;
      if (tsutils.isCallExpression(callExpression)) {
        const type = typeChecker.getTypeAtLocation(
          propertyAccessExpression.expression
        );
        if (couldBeType(type, "Observable")) {
          const name = propertyAccessExpression.name.getText();
          switch (name) {
            case "pipe":
              failures.push(
                ...this.validatePipe(sourceFile, typeChecker, callExpression)
              );
              break;
            case "subscribe":
              failures.push(
                ...this.validateArgs(sourceFile, typeChecker, callExpression)
              );
              break;
            default:
              throw new Error(`Unexpected property '${name}'`);
          }
        }
      }
    });

    return failures;
  }

  private validateArgs(
    sourceFile: ts.SourceFile,
    typeChecker: ts.TypeChecker,
    callExpression: ts.CallExpression
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const args = callExpression.arguments;
    const {
      ruleArguments: [options]
    } = this.getOptions();
    const allowNext =
      options && options.hasOwnProperty("allowNext") ? options.allowNext : true;

    if (args.length > 1) {
      args.forEach(arg => {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            arg.getStart(),
            arg.getStart() + arg.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      });
    } else if (args.length === 1 && !allowNext) {
      const [arg] = args;
      const type = typeChecker.getTypeAtLocation(arg);
      if (
        tsutils.isFunctionExpression(arg) ||
        tsutils.isArrowFunction(arg) ||
        couldBeFunction(type)
      ) {
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
    return failures;
  }

  private validatePipe(
    sourceFile: ts.SourceFile,
    typeChecker: ts.TypeChecker,
    callExpression: ts.CallExpression
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];

    const tapIdentifiers = tsquery(
      callExpression,
      `CallExpression Identifier[name="tap"]`
    );
    tapIdentifiers.forEach(tapIdentifier => {
      const { parent: callExpression } = tapIdentifier;
      if (tsutils.isCallExpression(callExpression)) {
        failures.push(
          ...this.validateArgs(sourceFile, typeChecker, callExpression)
        );
      }
    });
    return failures;
  }
}
