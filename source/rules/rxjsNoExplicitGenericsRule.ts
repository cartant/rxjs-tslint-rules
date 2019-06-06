/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { tsquery } from "@phenomnomnominal/tsquery";

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    description: "Disallows explicit generic type arguments.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: false,
    ruleName: "rxjs-no-explicit-generics",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING =
    "Explicit generic type arguments are forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const identifiers: ts.Identifier[] = [];

    identifiers.push(
      ...(tsquery(
        sourceFile,
        `CallExpression[expression.name.text="pipe"] > CallExpression[typeArguments.length>0] > Identifier`
      ) as ts.Identifier[])
    );

    identifiers.push(
      ...(tsquery(
        sourceFile,
        `CallExpression[typeArguments.length>0] > Identifier[name=/^(from|of)$/]`
      ) as ts.Identifier[])
    );

    identifiers.push(
      ...(tsquery(
        sourceFile,
        `NewExpression[typeArguments.length>0] > Identifier[name="BehaviorSubject"]`
      ) as ts.Identifier[])
    );

    const notificationIdentifiers = tsquery(
      sourceFile,
      `NewExpression[typeArguments.length>0] > Identifier[name="Notification"]`
    ) as ts.Identifier[];
    identifiers.push(
      ...notificationIdentifiers.filter(identifier => {
        const newExpression = identifier.parent as ts.NewExpression;
        const [arg] = newExpression.arguments;
        return tsutils.isStringLiteral(arg) && arg.text === "N";
      })
    );

    return identifiers.map(
      identifier =>
        new Lint.RuleFailure(
          sourceFile,
          identifier.getStart(),
          identifier.getStart() + identifier.getWidth(),
          Rule.FAILURE_STRING,
          this.ruleName
        )
    );
  }
}
