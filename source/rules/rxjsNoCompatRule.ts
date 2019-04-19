/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import { tsquery } from "@phenomnomnominal/tsquery";

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: undefined,
    description:
      "Disallows importation from locations that depend upon 'rxjs-compat'.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: false,
    ruleName: "rxjs-no-compat",
    type: "functionality",
    typescriptOnly: false
  };

  public static FAILURE_STRING =
    "'rxjs-compat' dependent import locations are forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const importDeclarations = tsquery(
      sourceFile,
      `ImportDeclaration:has(StringLiteral[value=/^rxjs\\u002f/])`
    );
    importDeclarations.forEach(node => {
      const importDeclaration = node as ts.ImportDeclaration;
      const { moduleSpecifier } = importDeclaration;
      if (
        !/^['"]rxjs\/(ajax|operators|testing|webSocket)['"]$/.test(
          moduleSpecifier.getText()
        )
      ) {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            moduleSpecifier.getStart(),
            moduleSpecifier.getStart() + moduleSpecifier.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      }
    });
    return failures;
  }
}
