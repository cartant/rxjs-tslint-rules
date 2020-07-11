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
    description:
      "Disallows implicit `any` error parameters in `catchError` operators.",
    options: {
      properties: {
        allowExplicitAny: { type: "boolean" },
      },
      type: "object",
    },
    optionsDescription: Lint.Utils.dedent`
      An optional object with an optional \`allowExplicitAny\` property.`,
    requiresTypeInfo: true,
    ruleName: "rxjs-no-implicit-any-catch",
    type: "functionality",
    typescriptOnly: true,
  };

  public static EXPLICIT_ANY = "Explicit any in catchError";
  public static IMPLICIT_ANY = "Implicit any in catchError";
  public static NARROWED = "Error type must be unknown or any";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const {
      ruleArguments: [options],
    } = this.getOptions();
    const allowExplicitAny =
      options && options.hasOwnProperty("allowExplicitAny")
        ? options.allowExplicitAny
        : false;
    const failures: Lint.RuleFailure[] = [];

    const callExpressions = tsquery(
      sourceFile,
      `CallExpression[expression.text="catchError"]`
    ) as ts.CallExpression[];

    callExpressions.forEach((callExpression) => {
      const [arg] = callExpression.arguments;
      if (!arg) {
        return;
      }
      if (ts.isArrowFunction(arg) || ts.isFunctionExpression(arg)) {
        const [parameter] = arg.parameters;
        if (parameter.type) {
          if (parameter.type.kind === ts.SyntaxKind.AnyKeyword) {
            if (allowExplicitAny) {
              return;
            }
            failures.push(
              new Lint.RuleFailure(
                sourceFile,
                parameter.getStart(),
                parameter.getStart() + parameter.getWidth(),
                Rule.EXPLICIT_ANY,
                this.ruleName,
                Lint.Replacement.replaceNode(parameter.type, "unknown")
              )
            );
          } else if (parameter.type.kind !== ts.SyntaxKind.UnknownKeyword) {
            failures.push(
              new Lint.RuleFailure(
                sourceFile,
                parameter.getStart(),
                parameter.getStart() + parameter.getWidth(),
                Rule.NARROWED,
                this.ruleName
              )
            );
          }
        } else {
          failures.push(
            new Lint.RuleFailure(
              sourceFile,
              parameter.getStart(),
              parameter.getStart() + parameter.getWidth(),
              Rule.IMPLICIT_ANY,
              this.ruleName,
              Lint.Replacement.appendText(
                parameter.getStart() + parameter.getWidth(),
                ": unknown"
              )
            )
          );
        }
      }
    });
    return failures;
  }
}
