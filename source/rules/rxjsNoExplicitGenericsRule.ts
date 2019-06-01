/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
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
        `NewExpression[typeArguments.length > 0] > Identifier[name="BehaviorSubject"]`
      ) as ts.Identifier[])
    );

    return identifiers.map(identifier => {
      const identifierLoc = identifier.parent.getChildren().indexOf(identifier);
      const typeArgumentStart = identifier.parent
        .getChildAt(identifierLoc + 1)
        .getStart();
      const typeArgumentEnd = identifier.parent
        .getChildAt(identifierLoc + 3)
        .getEnd();
      const fix = Lint.Replacement.replaceFromTo(
        typeArgumentStart,
        typeArgumentEnd,
        ""
      );

      return new Lint.RuleFailure(
        sourceFile,
        identifier.getStart(),
        identifier.getStart() + identifier.getWidth(),
        Rule.FAILURE_STRING,
        this.ruleName,
        fix
      );
    });
  }
}
