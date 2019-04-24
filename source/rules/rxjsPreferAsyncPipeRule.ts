/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import { tsquery } from "@phenomnomnominal/tsquery";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      "Disallows the calling of `subscribe` within an Angular component.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-prefer-async-pipe",
    type: "style",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Prefer async pipe over subscribe";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const componentIdentifiers = tsquery(
      sourceFile,
      `ClassDeclaration Identifier[name=/Component$/]`
    );
    componentIdentifiers.forEach(componentIdentifier => {
      const { parent: classDeclaration } = componentIdentifier;
      const propertyAccessExpressions = tsquery(
        classDeclaration,
        `CallExpression PropertyAccessExpression[name.name="subscribe"]`
      );
      propertyAccessExpressions.forEach(node => {
        const propertyAccessExpression = node as ts.PropertyAccessExpression;
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
    });
    return failures;
  }
}
